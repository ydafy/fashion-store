export interface CartItem {
  // IDs para una identificación única y robusta
  productId: string;
  variantId: string;
  inventoryId: string;

  // Identificador de inventario único
  sku: string;

  // Datos para mostrar en la UI (ya vienen del producto)
  name: string;
  image: string;
  blurhash?: string;
  price: number;
  colorName: string;
  size: string | number;

  // Datos específicos del carrito
  quantity: number;

  // Dato útil para validaciones
  stock: number;
}
