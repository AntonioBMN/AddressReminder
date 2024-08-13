import React, {useEffect, useState} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  View,
  AppState,
  AppStateStatus,
  Text,
} from 'react-native';
import CustomMap from './components/Map';
import {style} from './style';
import {IconButton} from './components/IconButton';
import Autocomplete from './components/Autocomplete';
import {LocationDto, RegionDto} from './home-dto';
import {loadLocations, saveLocations} from '../../services/location';
import {haversineDistance} from '../../utils/location-utils';
import NotificationModal from './components/NotificationModal';

const Home = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const {LocationModule, LocationServiceManager} = NativeModules;
  const locationEmitter = new NativeEventEmitter(LocationModule);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<boolean>(false);
  const [modal, showModal] = useState<{
    autocomplete: boolean;
    notification: boolean;
  }>({autocomplete: false, notification: false});
  const [currentLocation, setCurrentLocation] = useState<RegionDto>();
  const [savedLocations, setSavedLocations] = useState<LocationDto[]>([]);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (savedLocations !== undefined) {
      checkProximity();
    }
  }, [currentLocation]);

  useEffect(() => {
    trackAppState();
  }, [appState]);

  //Função responsavel por iniciar e encerrar o serviço de tracking em segundo plano
  //Quando o app está em segundo plano ele inicia o serviço e encerra quando o app retorna para primeiro plano
  const trackAppState = () => {
    const handleAppStateChange = (nextAppState: any) => {
      if (
        appState.match(/active/) &&
        nextAppState.match(/inactive|background/) &&
        permissions
      ) {
        LocationServiceManager.startService(savedLocations);
      } else if (
        appState.match(/inactive|background/) &&
        nextAppState.match(/active/)
      ) {
        LocationServiceManager.stopLocationService();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  };

  //Verifica as permissões e carrega os componentes caso esteja tudo ok
  const checkPermissions = () => {
    LocationModule.checkPermissions((permission: boolean) => {
      if (!permission) {
        setTimeout(checkPermissions, 1000);
      } else {
        setPermissions(true);
        loadUserLocation();
        loadSavedLocations();
      }
    });
  };

  //Função para atualizar a localização do usuário a cada chamada do evento
  const loadUserLocation = () => {
    const subscription = locationEmitter.addListener(
      'onLocationChanged',
      location => {
        setCurrentLocation({
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false);
        if (savedLocations !== undefined) {
          checkProximity();
        }
      },
    );

    // Inicia a atualização de localização
    LocationModule.startLocationUpdates();

    return () => {
      subscription.remove();
    };
  };

  //Carrega as localizações salvas em memoria
  const loadSavedLocations = async () => {
    const coordinates = await loadLocations();
    setSavedLocations(coordinates);
  };

  //Exibe o modal para cadastro de novos pontos
  const toggleModal = () => {
    showModal({...modal, autocomplete: !modal.autocomplete});
  };

  //Checa proximidade para calculo da distancia entre o usuário e os pontos.
  const checkProximity = () => {
    savedLocations!.forEach(savedLocation => {
      const distance = haversineDistance(currentLocation!, savedLocation);

      if (distance < 30) {
        sendNotification();
        return
      }
    });
  };

  //Exibe o modal de notificação
  const sendNotification = () => {
    if (!modal.autocomplete) {
      showModal({...modal, notification: true});
    }
  };

  const saveNewLocation = (location: LocationDto) => {
    saveLocations([...savedLocations, location]);
    showModal({...modal, autocomplete: false});
    loadSavedLocations();
  };

  const closeModalNotification = () => {
    showModal({...modal, notification: false});
  };
  //Exibe o mapa caso as permissões estejam aceitas.
  if (!loading) {
    return (
      <View style={style.container}>
        <CustomMap
          currentLocation={currentLocation!}
          savedLocations={savedLocations!}
        />
        {modal.notification && (
          <NotificationModal
            isModalVisible={modal.notification}
            closeModal={closeModalNotification}
          />
        )}
        {modal.autocomplete && (
          <Autocomplete saveNewLocation={saveNewLocation} />
        )}
        <IconButton
          icon={require('../../assets/icons/plus.png')}
          onPress={toggleModal}></IconButton>
      </View>
    );
  } else {
    return (
      <View style={style.permissionsDeny}>
        <Text style={style.text}>
          {' '}
          Você não permitiu o uso das localizações, acesse as configurações e
          permita{' '}
        </Text>
      </View>
    );
  }
};

export default Home;
