import {Dimensions, StyleSheet} from 'react-native';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: Dimensions.get('window').width,
    top: 50,
    alignItems: 'center',
  },

  textInput: {
    height: 38,
    color: 'black',
    fontSize: 16,
  },
  textInputContainer: {
    color: 'black',
  },
  predefinedPlacesDescription: {
    color: 'black',
  },
  containerAutocomplete: {
    width: '90%',
  },
});
