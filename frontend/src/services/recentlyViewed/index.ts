import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from '../../../App';

interface RecentlyViewedItem {
  productId: string;
  variantId: string;
}

export const getRecentlyViewed = async (): Promise<RecentlyViewedItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@recentlyViewed');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting recently viewed:', e);
    return [];
  }
};

export const addRecentlyViewed = async ({
  productId,
  variantId,
}: RecentlyViewedItem) => {
  try {
    const recentlyViewed = await getRecentlyViewed();
    const newItem = { productId, variantId };
    const updatedList = [
      newItem,
      ...recentlyViewed.filter(
        (item) =>
          !(item.productId === productId && item.variantId === variantId),
      ),
    ];
    queryClient.invalidateQueries({
      queryKey: ['productStrip', 'recentlyViewed'],
    });
    await AsyncStorage.setItem(
      '@recentlyViewed',
      JSON.stringify(updatedList.slice(0, 20)),
    );
  } catch (e) {
    console.error('Error adding recently viewed:', e);
  }
};
