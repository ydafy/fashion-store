import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Image as ExpoImage } from 'expo-image';
import { useQueries } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- Tipos ---
import { CommunityPost } from '../../types/community';
import { RootStackParamList } from '../../types/navigation';

// --- Lógica y Componentes ---
import { getProductById } from '../../services/product';
import ProductCard from '../product/productCard';
import ProductCardSkeleton from '../skeletons/ProductCardSkeleton';
import QuickAddItemPreview from '../quickadd/QuickAddItemPreview';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale, scale } from '../../utils/scaling';

const { width: screenWidth } = Dimensions.get('window');

interface CommunityPostModalProps {
  post: CommunityPost | null;
  onClose: () => void;
}

const CommunityPostModal: React.FC<CommunityPostModalProps> = ({
  post,
  onClose,
}) => {
  const { t } = useTranslation(['common', 'home']);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Efecto para controlar la visibilidad del modal
  useEffect(() => {
    if (post) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [post]);

  // Callback para manejar el cierre del modal
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  // Memorizamos la creación del array de queries para evitar re-fetches infinitos
  const queries = useMemo(() => {
    return (post?.featuredProducts ?? []).map((p) => ({
      queryKey: ['product', p.productId],
      queryFn: () => getProductById(p.productId),
      staleTime: 1000 * 60 * 5, // Cache de 5 minutos
      enabled: !!post, // Solo activa las queries cuando hay un 'post' seleccionado
    }));
  }, [post]);

  // Usamos useQueries para buscar todos los productos del post en paralelo
  const productQueries = useQueries({ queries });

  // Memorizamos el resultado para optimizar el renderizado
  const products = useMemo(
    () => productQueries.map((q) => q.data).filter(Boolean),
    [productQueries],
  );
  const isLoadingProducts = productQueries.some((q) => q.isLoading);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleProductPress = (productId: string, variantId?: string) => {
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
      params: {
        screen: 'ProductDetail',
        params: { productId, initialVariantId: variantId },
      },
    });
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['90%']}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.modalHandle}
      backgroundStyle={{ backgroundColor: COLORS.primaryBackground }}
    >
      <BottomSheetView style={styles.contentContainer}>
        {post && (
          <>
            <ExpoImage
              source={{ uri: post.imageUrl }}
              style={styles.mainImage}
              contentFit="cover"
            />
            <Text style={styles.userHandle}>
              {t('home:community.photoBy', { handle: post.userHandle })}
            </Text>

            <Text style={styles.shopTheLookTitle}>
              {t('home:community.shopTheLook')}
            </Text>

            {isLoadingProducts ? (
              <FlatList
                data={[1, 2]} // Renderiza dos skeletons para dar una mejor idea de la carga
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productList}
                renderItem={() => (
                  <View style={styles.productCardWrapper}>
                    <ProductCardSkeleton />
                  </View>
                )}
              />
            ) : (
              <FlatList
                data={products}
                keyExtractor={(item) => item!.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productList}
                renderItem={({ item: product }) => {
                  const featuredInfo = post.featuredProducts.find(
                    (p) => p.productId === product!.id,
                  );
                  const variantId =
                    featuredInfo?.variantId || product!.variants[0].id;
                  return (
                    <View style={styles.productCardWrapper}>
                      <QuickAddItemPreview
                        product={product!}
                        variantId={variantId}
                        onPress={() =>
                          handleProductPress(product!.id, variantId)
                        }
                      />
                    </View>
                  );
                }}
              />
            )}
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalHandle: { backgroundColor: COLORS.separator, width: 50 },
  contentContainer: { flex: 1, backgroundColor: COLORS.primaryBackground },
  mainImage: { width: '100%', aspectRatio: 4 / 5 },
  userHandle: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(7),
    fontStyle: 'italic',
    fontWeight: '600',
    fontFamily: 'FacultyGlyphic-Regular',
  },
  shopTheLookTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.primaryText,
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(10),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  productList: {
    paddingHorizontal: moderateScale(10),
    paddingBottom: verticalScale(5),
  },
  productCardWrapper: {
    width: screenWidth * 0.8,
    marginRight: scale(15),
  },
});

export default CommunityPostModal;
