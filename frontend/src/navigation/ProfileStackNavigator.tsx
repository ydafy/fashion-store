import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import PerfilScreen from '../screens/Profile/PerfilScreen';
import OrderHistoryScreen from '../screens/Orders/OrderHistoryScreen';
import OrderDetailScreen from '../screens/Orders/OrderDetailScreen';
import PaymentsScreen from '../screens/Profile/PaymentsScreen';
import AddPaymentMethodScreen from '../screens/Profile/AddPaymentMethodScreen';
import ProductDetailScreen from '../screens/Product/ProductDetailScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
//import AddressScreen from '../screens/Address/AddressScreen';
import ChangeEmailScreen from '../screens/Profile/ChangeEmailScreen';
import ChangePhoneScreen from '../screens/Profile/ChangePhoneScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
import ShippingInformationScreen from '../screens/Profile/ShippingInformationScreen';
import LegalDocumentScreen from '../screens/Profile/LegalDocumentScreen';
import HelpScreen from '../screens/Profile/HelpScreen';
import FAQScreen from '../screens/Profile/FAQScreen';
import QAScreen from '../screens/Profile/QAScreen';
import ContactScreen from '../screens/Profile/ContactScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

import FavoritesScreen from '../screens/Profile/FavoritesScreen';
import { ProfileStackParamList } from '../types/navigation';

import { COLORS } from '../constants/colors';

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const screenOptions: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
  animationDuration: 250,
  headerStyle: { backgroundColor: COLORS.primaryBackground }, // Estilo de header por defecto para este stack
  headerShown: false,
  headerTitleStyle: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: 20, // Puedes ajustar el tamaño
    fontWeight: 'normal',
  },
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={screenOptions}
      initialRouteName="PerfilScreen"
    >
      <ProfileStack.Group>
        <ProfileStack.Screen
          name="PerfilScreen"
          component={PerfilScreen}
          options={
            {
              // Si PerfilScreen usa tu CustomHeader globalmente, configúralo aquí
              // o mantenlo como lo tienes ahora (header personalizado dentro de PerfilScreen)
              // Ejemplo si PerfilScreen no tuviera su propio header:
              // Si PerfilScreen tiene su propio header interno, entonces:
              // headerShown: false,
            }
          }
        />
        <ProfileStack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ headerShown: false }} // Ya que OrderHistoryScreen tiene su propio header
        />
        <ProfileStack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ headerShown: false }} // Ya que OrderDetailScreen tiene su propio header
        />
        <ProfileStack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
        />
        <ProfileStack.Screen
          name="FavoritesScreen"
          component={FavoritesScreen}
          options={{}}
        />
        <ProfileStack.Screen
          name="Payments"
          component={PaymentsScreen}
          options={{ headerShown: false }}
        />
        <ProfileStack.Screen name="Settings" component={SettingsScreen} />

        <ProfileStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
        <ProfileStack.Screen name="ChangePhone" component={ChangePhoneScreen} />
        <ProfileStack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
        />
        <ProfileStack.Screen
          name="ShippingInformation"
          component={ShippingInformationScreen}
        />
        <ProfileStack.Screen
          name="LegalDocument"
          component={LegalDocumentScreen}
        />
        <ProfileStack.Screen name="Help" component={HelpScreen} />
        <ProfileStack.Screen name="FAQ" component={FAQScreen} />
        <ProfileStack.Screen name="QAScreen" component={QAScreen} />
        <ProfileStack.Screen name="Contact" component={ContactScreen} />
        <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      </ProfileStack.Group>

      {/* ✨ 3. GRUPO PARA LAS PANTALLAS QUE SE COMPORTAN COMO MODALES */}
      <ProfileStack.Group screenOptions={{ presentation: 'modal' }}>
        <ProfileStack.Screen
          name="AddPaymentMethod"
          component={AddPaymentMethodScreen}
        />
      </ProfileStack.Group>
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
