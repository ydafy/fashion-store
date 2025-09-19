import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { COLORS } from '../../constants/colors'; // Ajusta la ruta

interface AuthScreenContainerProps {
  children: ReactNode;
}

const screenHeight = Dimensions.get('window').height;

const AuthScreenContainer: React.FC<AuthScreenContainerProps> = ({
  children
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.background.backgroundColor}
      />
      <View style={styles.background}>
        <View style={styles.card}>{children}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFEBE4' // Color grisáceo de fondo general (ajusta según tu imagen)
  },
  background: {
    flex: 1,
    justifyContent: 'center', // Centra la tarjeta verticalmente
    alignItems: 'center', // Centra la tarjeta horizontalmente
    padding: 20, // Espacio alrededor de la tarjeta
    backgroundColor: '#EFEBE4' // Mismo color que safeArea
  },
  card: {
    width: '100%', // Ocupa el ancho disponible (limitado por el padding de 'background')
    maxWidth: 400, // Un ancho máximo para que no sea demasiado ancha en tablets
    backgroundColor: COLORS.primaryBackground,
    borderRadius: 20, // Bordes redondeados pronunciados
    padding: 30, // Padding interno de la tarjeta
    // Sombras para darle elevación (opcional, ajusta para el efecto deseado)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    minHeight: screenHeight * 0.65, // Asegura una altura mínima
    justifyContent: 'space-around' // Distribuye el espacio entre elementos hijos
  }
});

export default AuthScreenContainer;
