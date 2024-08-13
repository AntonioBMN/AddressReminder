import React, {useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import {style} from './style';
//Responsavel por exibir o botão com icone no centro.
export const IconButton = ({
  onPress,
  icon,
}: {
  onPress: any;
  icon: ImageSourcePropType | undefined;
}) => {
  return (
    <SafeAreaView style={style.container}>
      <Pressable
        onPress={onPress}>
        <Image style={style.image} source={icon} />
      </Pressable>
    </SafeAreaView>
  );
};
