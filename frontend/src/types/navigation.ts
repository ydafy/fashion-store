import {
  RouteProp,
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Address } from './address';

// =========================================================================
// 1. TIPOS DE PARÁMETROS PARA PANTALLAS ESPECÍFICAS
//    Define los "contratos" de las pantallas que reciben parámetros.
// =========================================================================

export type SectionScreenParams = {
  categoryId?: string;
  title?: string;
  searchQuery?: string;
  isNew?: boolean;
  shouldResetFilters?: boolean;
  filterPayload?: Record<string, any>;
};

// =========================================================================
// 2. DEFINICIÓN DE PARÁMETROS DE CADA STACK (PARAM LISTS)
//    El corazón de la navegación. Aquí se listan todas las pantallas que
//    pertenecen a un navegador específico.
// =========================================================================

// --- Parámetros para el flujo de Autenticación ---
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// --- Parámetros para el flujo de "Home" (Pestaña Principal) ---
export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetail: { productId: string; initialVariantId?: string };
  AddAddress: { searchQuery?: string } | undefined;
  EditAddress: { address: Address };
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
};

// --- Parámetros para el flujo de "Comprar" (Pestaña de Tienda) ---
export type ShopStackParamList = {
  ComprarScreen: undefined;
  Section: SectionScreenParams;
  SearchScreen: { isNew?: boolean } | undefined;
  ProductDetail: { productId: string; initialVariantId?: string };
};

// --- Parámetros para el flujo del Perfil ---
export type ProfileStackParamList = {
  PerfilScreen: undefined;
  Settings: undefined;
  EditProfile: undefined;
  FavoritesScreen: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  Payments: undefined;
  AddPaymentMethod: undefined;
  Addresses: undefined;
  ShippingInformation: undefined;
  ChangeEmail: undefined;
  ChangePhone: undefined;
  ChangePassword: undefined;
  LegalDocument: { documentType: 'terms' | 'privacy' };
  Help: undefined;
  FAQ: undefined;
  Contact: undefined;
  QAScreen: { categoryId: string; categoryTitleKey: string };
};

// --- Parámetros para el flujo del Carrito (si tuviera su propio stack) ---
export type CartStackParamList = {
  CartScreen: undefined;
};

// =========================================================================
// 3. PARÁMETROS DE NAVEGADORES PRINCIPALES (TABS y ROOT)
//    Estos tipos unen los stacks individuales en la estructura principal de la app.
// =========================================================================

// --- Define las pestañas del navegador principal ---
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ComprarTab: NavigatorScreenParams<ShopStackParamList>;
  Carrito: undefined;
  PerfilTab: NavigatorScreenParams<ProfileStackParamList>;
  FavoriteTab: undefined;
};

// --- Define el navegador raíz que contiene todo ---
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  Checkout: undefined;
};

// =========================================================================
// 4. TIPOS GENÉRICOS DE NAVEGACIÓN
//    Estos son helpers reutilizables para obtener tipos de navegación específicos.
// =========================================================================

export type AuthStackNavigatorProp<T extends keyof AuthStackParamList> =
  NativeStackNavigationProp<AuthStackParamList, T>;

export type RootStackNavigatorProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type MainBottomTabNavigationProp<T extends keyof MainTabParamList> =
  BottomTabNavigationProp<MainTabParamList, T>;

export type HomeNestedStackNavigatorProp<T extends keyof HomeStackParamList> =
  NativeStackNavigationProp<HomeStackParamList, T>;

// =========================================================================
// 5. TIPOS COMPUESTOS
//    Para pantallas que necesitan navegar a través de múltiples stacks anidados.
// =========================================================================

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<HomeStackParamList>
>;

export type CarritoScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Carrito'>,
  NativeStackNavigationProp<RootStackParamList>
>;

// =========================================================================
// 6. TIPOS DE PROPS COMPLETOS PARA CADA PANTALLA (navigation + route)
//    Estos son los tipos que usarás en la definición de tus componentes de pantalla.
//    Ej: const MiPantalla: React.FC<MiPantallaScreenProps> = ({ navigation, route }) => ...
// =========================================================================

// --- Props para pantallas del Flujo de Home y Comprar ---
export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'HomeScreen'>;
}

export interface ProductDetailScreenProps {
  navigation: HomeNestedStackNavigatorProp<'ProductDetail'>;
  route: RouteProp<HomeStackParamList, 'ProductDetail'>;
}

export interface SectionScreenProps {
  navigation: NativeStackNavigationProp<ShopStackParamList, 'Section'>;
  route: RouteProp<ShopStackParamList, 'Section'>;
}

export interface AddAddressScreenProps {
  navigation: HomeNestedStackNavigatorProp<'AddAddress'>;
  route: RouteProp<HomeStackParamList, 'AddAddress'>;
}

export interface EditAddressScreenProps {
  navigation: HomeNestedStackNavigatorProp<'EditAddress'>;
  route: RouteProp<HomeStackParamList, 'EditAddress'>;
}

// --- Props para pantallas del Flujo de Checkout ---
export interface CheckoutScreenProps {
  navigation: RootStackNavigatorProp<'Checkout'>;
  route: RouteProp<RootStackParamList, 'Checkout'>;
}

export type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;

// --- Props para pantallas de Pestañas Directas ---
export interface CategoriasScreenProps {
  navigation: MainBottomTabNavigationProp<'ComprarTab'>;
  route?: RouteProp<MainTabParamList, 'ComprarTab'>;
}

export interface CarritoScreenProps {
  navigation: CarritoScreenNavigationProp;
  route: RouteProp<MainTabParamList, 'Carrito'>;
}

export interface PerfilScreenProps {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'PerfilScreen'>;
  route?: RouteProp<ProfileStackParamList, 'PerfilScreen'>;
}

// --- Props para pantallas del Flujo de Autenticación ---
export interface LoginScreenProps {
  navigation: AuthStackNavigatorProp<'Login'>;
}

export type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export interface RegisterScreenProps {
  navigation: AuthStackNavigatorProp<'Register'>;
}

// --- Tipos de Ruta Individuales ---
export type QAScreenRouteProp = RouteProp<ProfileStackParamList, 'QAScreen'>;
