import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {LocationDto, RegionDto} from '../../home-dto';

//Componente de exibição do mapa
const CustomMap = ({
  currentLocation,
  savedLocations,
}: {
  currentLocation: RegionDto;
  savedLocations: LocationDto[];
}) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={currentLocation}>
        <Marker
          coordinate={currentLocation}
          pinColor="blue"
          title="Você está aqui">
          <View style={styles.userMark}></View>
        </Marker>
        {savedLocations.map(location => (
          <Marker
            onPress={test => {
              console.log(test.nativeEvent);
            }}
            key={Math.random()}
            coordinate={location}
          />
        ))}
      </MapView>
    </View>
  );
};

export default CustomMap;
