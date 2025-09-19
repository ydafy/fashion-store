import React, { useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useFavorites, FavoriteEntry } from '../../contexts/FavoritesContext';
import { useQuickAddModal } from '../../contexts/QuickAddContext';
import ProductCard from '../../components/product/productCard';
import GlobalHeader from '../../components/common/GlobalHeader';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import EmptyState from '../../components/common/EmptyState';
import { HeartIcon } from 'phosphor-react-native'; // ✨ Importamos el icono para el EmptyState

import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { RootStackParamList } from '../../types/navigation';

const ITEM_SPACING = scale(15);
const NUM_COLUMNS = 2;

const FavoritesScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { openQuickAddModal } = useQuickAddModal();
  const {
    favoriteProducts,
    favoriteEntries,
    isLoading,
    error,
    removeFavorite,
    fetchFavorites
  } = useFavorites();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <GlobalHeader
          title={t('favorites:screenTitle', { count: favoriteEntries.length })}
          showBackButton={true}
        />
      ),
      headerShown: true
    });
  }, [navigation, t, favoriteEntries.length]);

  // ✨ 1. La función ahora usa 'variantId'
  const handleRemoveFavorite = (
    productId: string,
    variantId: string,
    productName: string
  ) => {
    Alert.alert(
      t('favorites:removeAlert.title'),
      t('favorites:removeAlert.message', { name: productName }),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('favorites:removeAlert.removeButton'),
          onPress: () => removeFavorite(productId, variantId),
          style: 'destructive'
        }
      ]
    );
  };

  const navigateToHome = () => {
    // Esta es la forma canónica y segura de navegar a una pantalla
    // dentro de una pestaña diferente.
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
      params: {
        screen: 'HomeScreen'
      }
    });
  };

  const renderFavoriteItem = ({
    item: favoriteEntry
  }: {
    item: FavoriteEntry;
  }) => {
    const product = favoriteProducts.find(
      (p) => p.id === favoriteEntry.productId
    );

    if (!product) return null;

    return (
      <View style={styles.productCardWrapper}>
        {/* ✨ 3. Envolvemos ProductCard en un TouchableOpacity para el QuickAdd */}

        <ProductCard
          product={product}
          displayVariantId={favoriteEntry.variantId}
          onPress={() => openQuickAddModal(product, favoriteEntry.variantId)}
        />

        {/* ✨ 4. Botón de eliminar separado, superpuesto sobre la tarjeta */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() =>
            handleRemoveFavorite(
              product.id,
              favoriteEntry.variantId,
              product.name
            )
          }
        >
          <HeartIcon
            size={moderateScale(24)}
            weight="fill"
            color={COLORS.error}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading && favoriteEntries.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error && favoriteEntries.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ErrorDisplay
          errorMessage={error}
          onRetry={fetchFavorites}
          title={t('favorites:error.title')}
          message={t('favorites:error.message')}
        />
      </SafeAreaView>
    );
  }

  if (favoriteEntries.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        {/* ✨ Usamos el nuevo icono */}
        <EmptyState
          icon={<HeartIcon size={48} color={COLORS.secondaryText} />}
          message={t('favorites:empty.title')}
          subtext={t('favorites:empty.subtitle')}
        />
        <TouchableOpacity style={styles.exploreButton} onPress={navigateToHome}>
          <Text style={styles.exploreButtonText}>
            {t('favorites:empty.exploreButton')}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteEntries}
        renderItem={renderFavoriteItem}
        // ✨ 5. La key ahora usa 'variantId'
        keyExtractor={(item) => `${item.productId}_${item.variantId}`}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// --- ✨ 6. Estilos con un añadido para el botón de eliminar ✨ ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20)
  },
  listContentContainer: {
    paddingHorizontal: ITEM_SPACING / 2,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20)
  },
  productCardWrapper: {
    flex: 1 / NUM_COLUMNS,
    margin: ITEM_SPACING / 2
  },
  // ✨ Nuevo estilo para el botón de eliminar sobre la tarjeta
  removeButton: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),

    padding: moderateScale(6),
    borderRadius: moderateScale(20),
    zIndex: 10
  },
  exploreButton: {
    backgroundColor: COLORS.primaryText,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(30),
    borderRadius: 8,
    marginTop: verticalScale(20)
  },
  exploreButtonText: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: 'FacultyGlyphic-Regular'
  }
});

export default FavoritesScreen;
