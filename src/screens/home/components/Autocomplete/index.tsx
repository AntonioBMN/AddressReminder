import React from 'react';
import {View} from 'react-native';
import {style} from './style';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

//Responsavel por adicionar os pontos no centro
const Autocomplete = ({saveNewLocation}: any) => {
  return (
    <View style={style.container}>
      <GooglePlacesAutocomplete
        placeholder="Buscar local"
        fetchDetails={true}
        onPress={(data, details = null) => {
          const location = details?.geometry.location;
          saveNewLocation({
            latitude: location?.lat,
            longitude: location?.lng,
          });
        }}
        query={{
          key: "AIzaSyDuT5BGKJH-OIOq9PEvDtzTL5ExDGPmW6o",
          language: 'pt-BR',
        }}
        styles={{
          container: style.containerAutocomplete,
          predefinedPlacesDescription: style.predefinedPlacesDescription,
          textInputContainer: style.textInputContainer,
          textInput: style.textInput,
        }}
      />
    </View>
  );
};

export default Autocomplete;
