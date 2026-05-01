export const PAGE_CONFIG = {
  widthPx: 794,
  heightPx: 1122,
  marginTopPx: 80,
  marginBottomPx: 80,
  marginLeftPx: 64,
  marginRightPx: 64,
} as const;

export const CONTENT_WIDTH =
  PAGE_CONFIG.widthPx - PAGE_CONFIG.marginLeftPx - PAGE_CONFIG.marginRightPx;

export const CONTENT_HEIGHT =
  PAGE_CONFIG.heightPx - PAGE_CONFIG.marginTopPx - PAGE_CONFIG.marginBottomPx;
