import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';

//Pantallas
import HomeScreen from '../screens/Home/HomeScreen';
import ProductDetailScreen from '../screens/Product/ProductDetailScreen';
import ComprarScreen from '../screens/Buy/ComprarScreen';
import CarritoScreen from '../screens/Cart/CarritoScreen';

import SectionScreen from '../screens/Buy/SectionScreen';
import AddAddressScreen from '../screens/Address/AddAddressScreen';
import EditAddressScreen from '../screens/Address/EditAddressScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import SearchScreen from '../screens/Search/SearchScreen';

import ProfileStackNavigator from './ProfileStackNavigator';

//Context
import { useAuth } from '../contexts/AuthContext';

//Componentes
import GlobalHeader from '../components/common/GlobalHeader';

import {
  RootStackParamList,
  MainTabParamList,
  HomeStackParamList,
  AuthStackParamList,
  ShopStackParamList,
} from '../types/navigation';
import { COLORS } from '../constants/colors';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  const homeStackScreenOptions: NativeStackNavigationOptions = {
    headerStyle: { backgroundColor: COLORS.primaryBackground },
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    animation: 'slide_from_right',
    animationDuration: 250,
    headerTintColor: COLORS.primaryText,
    headerTitleStyle: {
      fontFamily: 'FacultyGlyphic-Regular',
      fontSize: 20, // Puedes ajustar el tamaño
      fontWeight: 'normal',
    },

    // headerShown: false, // Lo quitamos de aquí para que cada screen lo defina
  };
  return (
    <HomeStack.Navigator screenOptions={homeStackScreenOptions}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: true,
        }}
      />

      <HomeStack.Screen name="AddAddress" component={AddAddressScreen} />
      <HomeStack.Screen
        name="EditAddress"
        component={EditAddressScreen} // Usa el componente que crearemos
      />
    </HomeStack.Navigator>
  );
};
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // 👈  ADD tabBarIcon FUNCTION here
          let iconName:
            | 'home'
            | 'home-outline'
            | 'bag-add'
            | 'bag-add-outline'
            | 'cart'
            | 'cart-outline'
            | 'person'
            | 'person-outline'
            | 'warning-outline'
            | undefined; // 👈 Añade 'error-outline' y 'undefined' también

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline'; // Icono "home" (relleno si focused, outline si no)
          } else if (route.name === 'ComprarTab') {
            iconName = focused ? 'bag-add' : 'bag-add-outline'; // Icono "Buy"
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'cart' : 'cart-outline'; // Icono "shopping-cart"
          } else if (route.name === 'PerfilTab') {
            iconName = focused ? 'person' : 'person-outline'; // Icono "person"
          } else {
            iconName = 'warning-outline'; // 👈  Asegúrate de que el valor por defecto TAMBIÉN esté en la unión de tipos
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarInactiveTintColor: '#222121', // Keep your existing tabBarInactiveTintColor
        tabBarActiveTintColor: '#222121', // Keep your existing tabBarActiveTintColor
        //headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f9f6ee',
          height: 60,
          paddingTop: 5,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ComprarTab"
        component={ShopStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Carrito"
        component={CarritoScreen}
        options={{
          headerShown: false, // 👈 Muestra el header
          //header: () => <ProductDetailHeader title="Carrito" />
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          // ✨ AÑADIR ESTO ✨
          tabPress: (e) => {
            // Prevenir la acción de navegación por defecto para re-dirigir
            e.preventDefault();
            navigation.navigate('PerfilTab', {
              screen: 'PerfilScreen', // Siempre ir a PerfilScreen al tocar la pestaña
            });
          },
        })}
      />
    </Tab.Navigator>
  );
};

// --- ✨ NUEVO: AuthStackNavigator ---
const Auth = createNativeStackNavigator<AuthStackParamList>();
const AuthStackNavigator = () => {
  // Opciones para el stack de autenticación (ej. sin header)
  const authStackScreenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: 'slide_from_right',
    animationDuration: 250,
  };

  return (
    <Auth.Navigator screenOptions={authStackScreenOptions}>
      <Auth.Screen name="Login" component={LoginScreen} />
      <Auth.Screen name="Register" component={RegisterScreen} />
      <Auth.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Auth.Navigator>
  );
};
// --- Fin AuthStackNavigator ---

// ---. AppNavigator (RootStackNavigator - Componente principal exportado) ---
const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // Opciones de animación para Checkout (como antes)
  const { isAuthenticated, isLoading } = useAuth();
  // ✨ 1. DEFINE LAS OPCIONES DE ESTILO PARA EL HEADER DEL ROOTSTACK ✨
  const rootStackHeaderOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: COLORS.primaryBackground, // Mismo color de fondo
    },
    headerTintColor: COLORS.primaryText, // Color del título y botón de atrás
    headerTitleStyle: {
      fontFamily: 'FacultyGlyphic-Regular', // ✨ TU FUENTE PERSONALIZADA ✨
      fontSize: 20, // Tamaño consistente
      fontWeight: 'normal',
    },
  };
  const verticalSlideAnimation: NativeStackNavigationOptions = {
    presentation: 'modal',
    animation: 'slide_from_bottom',
    animationDuration: 300,
  };
  // ✨ Mostrar un loader o splash screen mientras el estado de auth se determina (opcional)
  if (isLoading) {
    // Podrías retornar un componente de SplashScreen aquí
    // Por ahora, retornamos null o un simple View de carga
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <ActivityIndicator size="large" /> */}
        <Text>Cargando app...</Text>
      </View>
    );
  }

  return (
    <>
      <RootStack.Navigator>
        {isAuthenticated ? (
          <>
            <RootStack.Screen
              name="MainTabs"
              component={MainTabsNavigator}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{
                headerShown: true,
                ...rootStackHeaderOptions,
                ...verticalSlideAnimation,
              }}
            />
          </>
        ) : (
          <RootStack.Screen
            name="AuthStack"
            component={AuthStackNavigator}
            options={{ headerShown: false }}
          />
        )}
      </RootStack.Navigator>

      {/* Al estar fuera del Navigator, puede flotar por encima de cualquier pantalla */}
    </>
  );
};

// ✨ STACK PARA "COMPRAR" ✨
const ShopStack = createNativeStackNavigator<ShopStackParamList>();

const ShopStackNavigator = () => {
  // Usamos las mismas opciones de estilo que los otros stacks
  const stackHeaderOptions: NativeStackNavigationOptions = {
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    animation: 'slide_from_right',
    animationDuration: 250,
    headerStyle: { backgroundColor: COLORS.primaryBackground },
    headerTintColor: COLORS.primaryText,
    headerTitleStyle: {
      fontFamily: 'FacultyGlyphic-Regular',
      fontSize: 18,
      fontWeight: 'normal',
    },
  };

  return (
    <ShopStack.Navigator screenOptions={stackHeaderOptions}>
      <ShopStack.Group screenOptions={{ headerShown: false }}>
        <ShopStack.Screen name="ComprarScreen" component={ComprarScreen} />
        <ShopStack.Screen name="Section" component={SectionScreen} />
        <ShopStack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
        />
      </ShopStack.Group>
      <ShopStack.Group
        screenOptions={{ presentation: 'modal', headerShown: false }}
      >
        <ShopStack.Screen name="SearchScreen" component={SearchScreen} />
      </ShopStack.Group>
    </ShopStack.Navigator>
  );
};

export default AppNavigator;
