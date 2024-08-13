import {Dimensions, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userMark: {
    height: 15,
    width: 15,
    borderRadius: 10,
    color: "blue",
    backgroundColor: "blue"

  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
