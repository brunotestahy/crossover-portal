export const COOKIE_NAME = 'cookieLevel';
export const COOKIES_ADS_LEVEL = '1';
export const COOKIES_ANALYTICS_LEVEL = '2';
export const COOKIES_REQUIRED_LEVEL = '3';
export const COOKIES_EXPIRATION_YEARS = 20;
export const COOKIES_SLIDER_TO_LEVEL_MAP = {
  0: COOKIES_REQUIRED_LEVEL,
  1: COOKIES_ANALYTICS_LEVEL,
  2: COOKIES_ADS_LEVEL,
};
export const COOKIES_LEVEL_TO_SLIDER_MAP: {[key: string]: 0 | 1 | 2} = {
  '3' : 0,
  '2' : 1,
  '1' : 2,
};
export const COOKIES_REQUIRED_SLIDER = 0;
export const COOKIES_ANALYTICS_SLIDER = 1;
export const COOKIES_ADS_SLIDER = 2;
export type COOKIES_SLIDER = 0 | 1 | 2;
