import React from 'react';
import {
  Button,
  Modal,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from 'react-native';
import {styles} from './styles.ts';

//Exibe a modal de notificação
const NotificationModal = ({
  isModalVisible,
  closeModal,
}: {
  isModalVisible: boolean;
  closeModal: ((event: NativeSyntheticEvent<any>) => void) | undefined;
}) => {
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Você está próximo de um ponto cadastrado!
          </Text>
          <Button title="Fechar" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

export default NotificationModal;
