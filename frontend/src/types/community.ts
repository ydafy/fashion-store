export interface FeaturedProduct {
  productId: string;
  variantId?: string; // Hacemos la variante opcional
}

export interface CommunityPost {
  id: string;
  imageUrl: string;
  userHandle: string;
  featuredProducts: FeaturedProduct[];
}
