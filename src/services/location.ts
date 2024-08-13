import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocationDto} from '../screens/home/home-dto';

export const saveLocations = async (locations: LocationDto[]) => {
  try {
    const jsonValue = JSON.stringify(locations);
    await AsyncStorage.setItem('locations', jsonValue);
    console.log('Array salvo com sucesso!');
  } catch (e) {
    console.error('Erro ao salvar o array:', e);
  }
};

export const loadLocations = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('locations');
    if (jsonValue === null) {
      await AsyncStorage.setItem('locations', JSON.stringify([]));
    }
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao carregar o array:', e);
  }
};
