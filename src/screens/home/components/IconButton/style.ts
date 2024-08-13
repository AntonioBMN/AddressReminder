import {Dimensions, StyleSheet} from 'react-native';

export const style = StyleSheet.create({
  container: {
    flex:1,
    zIndex: 3,
    position: 'absolute',
    backgroundColor: '#c3c3c3',
    right:0,
    bottom: 0,
    borderWidth:2,
    borderColor: "#808080",
    borderRadius: 50,
    margin: 30,
  },
  image: {
    width: 30,
    height: 30,
    margin: 30,
  },
});
