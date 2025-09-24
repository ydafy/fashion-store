/* eslint-disable react-native/no-color-literals */
import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../constants/colors';

interface AuthScreenContainerProps {
  children: ReactNode;
}

const screenHeight = Dimensions.get('window').height;

const AuthScreenContainer: React.FC<AuthScreenContainerProps> = ({
  children,
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
    backgroundColor: '#EFEBE4',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFEBE4',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.primaryBackground,
    borderRadius: 20,
    padding: 30,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    minHeight: screenHeight * 0.65,
    justifyContent: 'space-around',
  },
});

export default AuthScreenContainer;
