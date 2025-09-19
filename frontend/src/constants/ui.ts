export const EDITORIAL = {
  SKELETON_COUNT: 3,
  CARD_WIDTH: 250,
  CARD_HEIGHT: 370,
  TRANSITION_MS: 1000,
  SCROLL_CONFIG: {
    DECELERATION_RATE: 'fast' as const,
    SNAP_INTERVAL: 40, // espacio entre cards
  },
  TOUCH_CONFIG: {
    ACTIVE_OPACITY: 0.7,
    HIT_SLOP: { top: 10, bottom: 10, left: 10, right: 10 },
    PRESS_RETENTION: { top: 20, left: 20, bottom: 20, right: 20 },
  },
  ANIMATION: {
    SCALE_PRESSED: 0.97,
    OPACITY_PRESSED: 0.9,
  },
} as const;
