// src/components/favorites/favoriteLayoutConstants.ts
import { Dimensions } from 'react-native';
import { scale } from '../../utils/scaling';

const screenWidth = Dimensions.get('window').width;

// Horizontal padding that ProfileScreen applies around the favorites section
const PROFILE_SCREEN_CONTENT_PADDING_HORIZONTAL = scale(20);

// Total width available for a carousel slide (a 2x2 block)
export const CAROUSEL_SLIDE_WIDTH =
  screenWidth - PROFILE_SCREEN_CONTENT_PADDING_HORIZONTAL * 2;

// Dimensions for each FavoritePreviewItem within the 2x2 block
export const GAP_BETWEEN_ITEMS_IN_SLIDE_ROW = scale(10); // Horizontal space between the two items in a row
export const PREVIEW_ITEM_WIDTH =
  (CAROUSEL_SLIDE_WIDTH - GAP_BETWEEN_ITEMS_IN_SLIDE_ROW) / 2;
export const PREVIEW_ITEM_ASPECT_RATIO = 1.25; // Or 1.0 if you want squares, or whatever ratio you want
export const PREVIEW_ITEM_HEIGHT =
  PREVIEW_ITEM_WIDTH * PREVIEW_ITEM_ASPECT_RATIO;
export const PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS = scale(10); // Vertical space between the two rows of the 2x2 block

// Total height of the carousel (for 2 rows of items)
export const CAROUSEL_HEIGHT =
  PREVIEW_ITEM_HEIGHT * 2 + PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS;

// Constants for skeletons and placeholders if they are different, or you can use the ones above
export const SKELETON_ITEM_WIDTH = PREVIEW_ITEM_WIDTH;
export const SKELETON_ITEM_HEIGHT = PREVIEW_ITEM_HEIGHT;
export const SKELETON_ITEM_MARGIN_BOTTOM = PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS;
export const SKELETON_ITEMS_IN_BLOCK_CAROUSEL = 4;

export const PLACEHOLDER_ITEM_WIDTH = PREVIEW_ITEM_WIDTH;
export const PLACEHOLDER_ITEM_HEIGHT = PREVIEW_ITEM_HEIGHT;
export const PLACEHOLDER_ITEM_MARGIN_BOTTOM =
  PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS;
