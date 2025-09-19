import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- Lógica y Tipos ---
import { useFeaturedSaleProducts } from '../../hooks/useFeaturedSaleProducts';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';
import { processUnknownError } from '../../utils/errorUtils';

// --- Componentes de UI ---
import MosaicProductCard from './MosaicProductCard'; // Nuestro nuevo componente especializado
import SectionHeader from '../common/SectionHeader';
import { Skeleton } from '../skeletons/Skeleton';
import ErrorDisplay from '../common/ErrorDisplay';

// --- Constantes y Utils ---
import { scale, verticalScale, moderateScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

/**
 * Componente Skeleton para mostrar mientras se cargan los datos del mosaico.
 * Imita el layout 1:2 para una transición visual suave.
 */
const SaleMosaicSkeleton = () => (
  <View style={styles.mosaic}>
    <View style={styles.largeProduct}>
      <Skeleton style={styles.skeletonItem} />
    </View>
    <View style={styles.smallProducts}>
      <Skeleton style={styles.skeletonItem} />
      <Skeleton style={styles.skeletonItem} />
    </View>
  </View>
);

/**
 * SaleMosaic es un componente de sección "inteligente" que muestra los 3 productos
 * en oferta más destacados en un layout asimétrico (1 grande, 2 pequeños).
 */
const SaleMosaic: React.FC = () => {
  const { t } = useTranslation(['shop', 'common']);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 1. OBTENCIÓN DE DATOS: Usamos nuestro hook dedicado para obtener los productos.
  const { data: products, status, error, refetch } = useFeaturedSaleProducts();
  const processedError = processUnknownError(error);

  // 2. NAVEGACIÓN: Creamos un handler memoizado para la acción de presionar una tarjeta.
  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('MainTabs', {
        screen: 'HomeTab', // Puede ser 'HomeTab' o 'ComprarTab' según tu preferencia de navegación
        params: {
          screen: 'ProductDetail',
          params: {
            productId: product.id,
            // Pasamos la primera variante por defecto al navegar desde aquí
            initialVariantId: product.variants[0]?.id,
          },
        },
      });
    },
    [navigation],
  );

  // 3. RENDERIZADO CONDICIONAL: Gestionamos todos los estados posibles de la carga de datos.
  const renderContent = () => {
    switch (status) {
      case 'pending':
        // Muestra el skeleton mientras los datos están cargando.
        return <SaleMosaicSkeleton />;

      case 'error':
        // Usa nuestra utilidad de errores para un manejo seguro y consistente.

        return (
          <ErrorDisplay
            message={t(
              processedError.messageKey,
              processedError.fallbackMessage,
            )}
            onRetry={refetch}
          />
        );

      case 'success':
        // Si la carga fue exitosa pero no tenemos suficientes productos para el layout, no mostramos nada.
        if (!products || products.length < 3) {
          return null;
        }
        // Si todo está bien, renderizamos el mosaico.
        return (
          <View style={styles.mosaic}>
            <View style={styles.largeProduct}>
              <MosaicProductCard
                product={products[0]}
                onPress={handleProductPress}
              />
            </View>
            <View style={styles.smallProducts}>
              {/* Usamos un fragmento para que el 'gap' del contenedor padre se aplique correctamente */}
              <>
                <MosaicProductCard
                  product={products[1]}
                  onPress={handleProductPress}
                />
                <MosaicProductCard
                  product={products[2]}
                  onPress={handleProductPress}
                />
              </>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  // El componente principal que une el header y el contenido.
  return (
    <View style={styles.container}>
      <SectionHeader
        title={t('shop:saleMosaic.title')}
        actionText={t('common:viewAll')}
        onActionPress={() => {
          // Navega a la SectionScreen con el filtro de "en oferta" activado.
          navigation.navigate('MainTabs', {
            screen: 'ComprarTab',
            params: {
              screen: 'Section',
              params: {
                title: t('shop:saleMosaic.title'),
                filterPayload: { onSale: true },
              },
            },
          });
        }}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  mosaic: {
    flexDirection: 'row',
    height: verticalScale(400), // Altura fija total para el mosaico
    gap: scale(15), // Espacio horizontal entre la columna grande y la pequeña
  },
  largeProduct: {
    flex: 0.55, // La columna grande ocupa el 55% del ancho
  },
  smallProducts: {
    flex: 0.45, // La columna pequeña ocupa el 45%
    flexDirection: 'column',
    gap: scale(15), // Espacio vertical entre las dos tarjetas pequeñas
  },
  skeletonItem: {
    flex: 1,
    borderRadius: moderateScale(10),
  },
});

export default SaleMosaic;
