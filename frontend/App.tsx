import './src/config/i18n';
import React, { useState, useEffect, useCallback } from 'react';

import { View, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';

// --- Configuración ---
import { toastConfig } from './src/config/toastConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { COLORS } from './src/constants/colors';

// --- Navegación ---
import AppNavigator from './src/navigation/AppNavigator';

// --- Context Providers ---
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { AddressProvider } from './src/contexts/AddressContext';
import { AddressModalProvider } from './src/contexts/AddressModalContext';
import { ShareModalProvider } from './src/contexts/ShareModalContext';
import { QuickAddProvider } from './src/contexts/QuickAddContext';
import { ProductProvider } from './src/contexts/ProductContext';
import { FilterProvider } from './src/contexts/FilterContext';

// --- Componentes Globales (Modales) ---
import GlobalAddressModal from './src/components/modal/GlobalAddressModal';
import ShareProductModal from './src/components/modal/ShareProductModal';
import QuickAddModal from './src/components/quickadd/QuickAddModal';

SplashScreen.preventAutoHideAsync();
export const queryClient = new QueryClient();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          // 🔻 MODIFICADO: Añadimos un comentario para que ESLint ignore esta línea específica.
          // eslint-disable-next-line
          'FacultyGlyphic-Regular': require('./assets/fonts/FacultyGlyphic-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    // 🔻 MODIFICADO: Se usa el estilo desde StyleSheet
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ProductProvider>
              <FilterProvider>
                <FavoritesProvider>
                  <CartProvider>
                    <AddressProvider>
                      <AddressModalProvider>
                        <ShareModalProvider>
                          <QuickAddProvider>
                            <BottomSheetModalProvider>
                              <KeyboardProvider>
                                <View
                                  style={styles.container}
                                  onLayout={onLayoutRootView}
                                >
                                  <NavigationContainer>
                                    <AppNavigator />
                                    <GlobalAddressModal />
                                    <ShareProductModal />
                                    <QuickAddModal />
                                    <Toast
                                      config={toastConfig}
                                      topOffset={
                                        (StatusBar.currentHeight || 0) + 10
                                      }
                                    />
                                  </NavigationContainer>
                                </View>
                              </KeyboardProvider>
                            </BottomSheetModalProvider>
                          </QuickAddProvider>
                        </ShareModalProvider>
                      </AddressModalProvider>
                    </AddressProvider>
                  </CartProvider>
                </FavoritesProvider>
              </FilterProvider>
            </ProductProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ✨ AÑADIDO: Todos los estilos ahora están centralizados aquí.
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,

    backgroundColor: COLORS.primaryBackground,
  },
});
