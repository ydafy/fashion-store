import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- Importaciones Clave ---
import { useCategories } from '../../hooks/useCategories';
import { usePromotionalHubs } from '../../hooks/usePromotionalHubs';
import { RootStackParamList, ShopStackParamList } from '../../types/navigation';
import { Category, Subcategory, TranslationObject } from '../../types/category'; // ✨ Importamos los tipos
import GlobalHeader, {
  HeaderAction,
} from '../../components/common/GlobalHeader';
import AccordionItem from '../../components/common/AccordionItem';
import { IconFactory } from '../../components/icons/IconFactory';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import CategorySkeleton from '../../components/skeletons/CategorySkeleton';
import { MagnifyingGlassIcon } from 'phosphor-react-native'; // ✨ Corregimos el nombre del icono
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

import { PromotionalHubGroup } from '../../types/promotionalHub';
import PromotionalHubCarousel from '../../components/shop/PromotionalHubCarousel';
import PromotionalHubSkeleton from '../../components/skeletons/PromotionalHubSkeleton';
import QuickFiltersGrid from '../../components/shop/QuickFiltersGrid';
import ColorFilterCarousel from '../../components/shop/ColorFilterCarousel';
import SectionHeader from '../../components/common/SectionHeader';
import EditorialSection from '../../components/shop/EditorialSection';
import CustomErrorBoundary from '../../components/common/ErrorBoundary';
import ProductStripCarousel from '../../components/shop/ProductStripCarousel';
import SaleMosaic from '../../components/shop/SaleMosaic';
import CategoryAccordion from '../../components/shop/CategoryAccordion';

const ComprarScreen = () => {
  const { t, i18n } = useTranslation(['shop', 'common']);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Llamamos al hook sin pasar el idioma, ya que el hook lo obtiene internamente
  const {
    categories,
    status: categoriesStatus,
    error: categoriesError,
    refetchCategories,
  } = useCategories();

  const {
    data: hubsData,
    status: hubsStatus,
    error: hubsError,
    refetch: refetchHubs,
  } = usePromotionalHubs();

  // --- Lógica del Header ---
  useLayoutEffect(() => {
    const rightActions: HeaderAction[] = [
      {
        icon: (
          <MagnifyingGlassIcon
            size={moderateScale(26)}
            color={COLORS.primaryText}
            weight="regular"
          />
        ),
        onPress: () => {
          navigation.navigate('MainTabs', {
            screen: 'ComprarTab',
            params: {
              // Le decimos al ShopStack que navegue a la pantalla SearchScreen
              screen: 'SearchScreen',
              params: undefined, // SearchScreen no necesita parámetros
            },
          });
        },
        accessibilityLabelKey: 'common:search',
      },
    ];
    navigation.setOptions({
      header: () => (
        <GlobalHeader title={t('shop:title')} rightActions={rightActions} />
      ),
      headerShown: true,
    });
  }, [navigation, t]);

  // ✨ 1. La lógica de traducción ahora vive aquí
  const handleSubCategoryPress = (subCategory: Subcategory) => {
    const lang = i18n.language as keyof TranslationObject;
    const subCategoryTitle = subCategory.name[lang] || subCategory.name.es;

    // Le damos la ruta completa desde la raíz de la app
    navigation.navigate('MainTabs', {
      // 1. Ve al navegador de Pestañas
      screen: 'ComprarTab', // 2. Activa la pestaña "Comprar"
      params: {
        // 3. Pasa parámetros a su Stack interno (ShopStack)
        screen: 'Section', // 4. Dile que la pantalla a mostrar es "Section"
        params: {
          // 5. Y aquí están los parámetros para "Section"
          categoryId: subCategory.id,
          title: subCategoryTitle,
        },
      },
    });
  };

  const renderHubs = () => {
    switch (hubsStatus) {
      case 'pending':
        return <PromotionalHubSkeleton />;
      case 'error':
        return (
          <ErrorDisplay message={hubsError.message} onRetry={refetchHubs} />
        );
      case 'success': {
        const bestSellersHub: PromotionalHubGroup = hubsData.bestSellers;
        if (!bestSellersHub) return null;
        return (
          <PromotionalHubCarousel
            title={bestSellersHub.title}
            hubs={bestSellersHub.hubs}
          />
        );
      }
      default:
        return null;
    }
  };

  const renderCategories = () => {
    const lang = i18n.language as keyof TranslationObject;

    switch (categoriesStatus) {
      case 'pending':
        return (
          <View style={styles.sectionContainer}>
            <SectionHeader title={t('shop:categories.title')} />
            <View style={styles.accordionList}>
              {Array.from({ length: 5 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </View>
          </View>
        );
      case 'error':
        return (
          <View style={styles.sectionContainer}>
            <SectionHeader title={t('shop:categories.title')} />
            <ErrorDisplay
              message={categoriesError?.message || t('common:genericError')}
              onRetry={refetchCategories}
            />
          </View>
        );
      case 'success':
        return (
          <View style={styles.sectionContainer}>
            <SectionHeader title={t('shop:categories.title')} />
            <View style={styles.accordionList}>
              {categories?.map((category: Category) => {
                const categoryTitle = category.name[lang] || category.name.es;
                return (
                  // ✨ 2. USAMOS NUESTRO NUEVO COMPONENTE
                  <CategoryAccordion
                    key={category.id}
                    categoryName={categoryTitle}
                    categoryIconName={category.iconName}
                  >
                    <View>
                      {category.subcategories.map((sub: Subcategory) => {
                        const subCategoryTitle = sub.name[lang] || sub.name.es;
                        return (
                          <TouchableOpacity
                            key={sub.id}
                            style={styles.subCategoryButton}
                            onPress={() => handleSubCategoryPress(sub)}
                          >
                            <Text style={styles.subCategoryText}>
                              {subCategoryTitle}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </CategoryAccordion>
                );
              })}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <CustomErrorBoundary>
          <EditorialSection />

          {renderHubs()}

          {renderCategories()}
          <ProductStripCarousel
            type="newArrivals"
            title={t('shop:productStrip.newArrivalsTitle')}
          />

          <QuickFiltersGrid />
          <SaleMosaic />
          <ColorFilterCarousel />

          <ProductStripCarousel
            type="recentlyViewed"
            title={t('shop:productStrip.recentlyViewedTitle')}
          />
        </CustomErrorBoundary>
      </ScrollView>
    </>
  );
};

// --- Estilos (Eliminamos los de skeleton que ahora están en su propio archivo) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  sectionContainer: {},
  contentContainer: {
    paddingTop: verticalScale(20), // Espacio superior
    paddingBottom: verticalScale(40), // Espacio inferior para el final del scroll
    flexGrow: 1,
  },
  accordionList: { paddingHorizontal: moderateScale(4) },
  subCategoryButton: {
    paddingVertical: verticalScale(12),
    paddingLeft: scale(10),
  },
  subCategoryText: {
    fontSize: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
  },
});

export default ComprarScreen;
