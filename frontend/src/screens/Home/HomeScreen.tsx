import React, { useCallback, useState } from 'react';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { HeartIcon } from 'phosphor-react-native';

// --- Tipos y Hooks ---
import { HomeScreenProps } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native'; // ✨ 1. Usamos el hook genérico
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // ✨ 2. Importamos el tipo

import { useHeroCarouselProducts } from '../../hooks/useHeroCarouselProducts';

import { useCollections } from '../../hooks/useCollections';
import { useRecommendedProducts } from '../../hooks/useRecommendedProducts';

// --- Componentes ---
import GlobalHeader, {
  HeaderAction,
} from '../../components/common/GlobalHeader';
import HeroCarousel from '../../components/home/HeroCarousel';
import CollectionsSection from '../../components/home/CollectionsSection';
import RecommendedProductsSection from '../../components/home/RecommendedProductsSection';
import { RootStackParamList } from '../../types/navigation';
import LookbookSection from '../../components/home/LookbookSection';
import BrandFooter from '../../components/common/BrandFooter';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';
import CommunitySection from '../../components/home/CommunitySection';

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { t } = useTranslation(['home', 'header', 'common']);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isRefreshing, setIsRefreshing] = useState(false);
  // Usamos nuestros hooks de TanStack Query
  const {
    data: heroProducts,
    isLoading: isLoadingHero,
    refetch: refetchHero,
  } = useHeroCarouselProducts();
  const {
    data: collections,
    isLoading: isLoadingCollections,
    refetch: refetchCollections,
  } = useCollections();
  const {
    data: recommendedProducts,
    isLoading: isLoadingRecommended,
    refetch: refetchRecommended,
  } = useRecommendedProducts();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true); // Muestra el indicador de refresco
    try {
      // Todas las llamadas de refetch se ejecutan en paralelo
      await Promise.all([
        refetchHero(),
        refetchCollections(),
        refetchRecommended(),
        // ... otros refetch
      ]);
    } catch (error) {
      console.error('Failed to refresh home screen data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchHero, refetchCollections, refetchRecommended]);

  const rightActions: HeaderAction[] = [
    {
      icon: (
        <HeartIcon
          size={moderateScale(26)}
          color={COLORS.primaryText}
          weight="regular"
        />
      ),
      onPress: () =>
        navigation.navigate('MainTabs', {
          screen: 'PerfilTab',
          params: { screen: 'FavoritesScreen' },
        }),
      accessibilityLabelKey: 'header:favoritesLabel',
    },
  ];

  const sections = [
    {
      key: 'recommended',
      render: () => (
        <View>
          <RecommendedProductsSection
            products={recommendedProducts || []}
            isLoading={isLoadingRecommended}
            title={t('home:recommended.titleDefault')}
          />
        </View>
      ),
    },
    {
      key: 'hero',
      render: () => (
        <View>
          <HeroCarousel
            products={heroProducts || []}
            isLoading={isLoadingHero}
          />
        </View>
      ),
    },
    {
      key: 'collections',
      render: () => (
        <View>
          <CollectionsSection
            sections={collections || []}
            isLoading={isLoadingCollections}
            title={t('home:collections.titleDefault')}
            navigation={navigation as any}
          />
        </View>
      ),
    },

    {
      key: 'lookbook',
      render: () => (
        <View>
          <LookbookSection />
        </View>
      ),
    },
    {
      key: 'community',
      render: () => (
        <View>
          <CommunitySection />
        </View>
      ),
    },

    { key: 'footer', render: () => <BrandFooter /> },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <GlobalHeader showAddressSelector={true} rightActions={rightActions} />

      <FlatList
        data={sections}
        renderItem={({ item }) => item.render()}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent, COLORS.primaryText]}
            tintColor={COLORS.accent}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  listContent: {
    paddingBottom: verticalScale(10),
  },
});

export default HomeScreen;
