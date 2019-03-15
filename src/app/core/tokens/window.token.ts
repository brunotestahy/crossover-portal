import { InjectionToken } from '@angular/core';

export const WINDOW_TOKEN = new InjectionToken<Window>('window');

export function windowFactory(): Window {
  return window;
}
