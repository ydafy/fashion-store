// src/components/favorites/favoriteLayoutConstants.ts
import { Dimensions } from 'react-native';
import { scale } from '../../utils/scaling'; // Asegúrate que la ruta a scaling sea correcta

const screenWidth = Dimensions.get('window').width;

// Padding horizontal que PerfilScreen aplica alrededor de la sección de favoritos
const PROFILE_SCREEN_CONTENT_PADDING_HORIZONTAL = scale(20);

// Ancho total disponible para un slide del carrusel (un bloque 2x2)
export const CAROUSEL_SLIDE_WIDTH =
  screenWidth - PROFILE_SCREEN_CONTENT_PADDING_HORIZONTAL * 2;

// Dimensiones para cada FavoritePreviewItem dentro del bloque 2x2
export const GAP_BETWEEN_ITEMS_IN_SLIDE_ROW = scale(10); // Espacio horizontal entre los dos ítems de una fila
export const PREVIEW_ITEM_WIDTH =
  (CAROUSEL_SLIDE_WIDTH - GAP_BETWEEN_ITEMS_IN_SLIDE_ROW) / 2;
export const PREVIEW_ITEM_ASPECT_RATIO = 1.25; // O 1.0 si quieres cuadrados, o la proporción que desees
export const PREVIEW_ITEM_HEIGHT =
  PREVIEW_ITEM_WIDTH * PREVIEW_ITEM_ASPECT_RATIO;
export const PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS = scale(10); // Espacio vertical entre las dos filas del bloque 2x2

// Altura total del carrusel (para 2 filas de ítems)
export const CAROUSEL_HEIGHT =
  PREVIEW_ITEM_HEIGHT * 2 + PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS;

// Constantes para los skeletons y placeholders si son diferentes, o pueden usar las de arriba
export const SKELETON_ITEM_WIDTH = PREVIEW_ITEM_WIDTH;
export const SKELETON_ITEM_HEIGHT = PREVIEW_ITEM_HEIGHT;
export const SKELETON_ITEM_MARGIN_BOTTOM = PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS;
export const SKELETON_ITEMS_IN_BLOCK_CAROUSEL = 4;

export const PLACEHOLDER_ITEM_WIDTH = PREVIEW_ITEM_WIDTH;
export const PLACEHOLDER_ITEM_HEIGHT = PREVIEW_ITEM_HEIGHT;
export const PLACEHOLDER_ITEM_MARGIN_BOTTOM =
  PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS;
