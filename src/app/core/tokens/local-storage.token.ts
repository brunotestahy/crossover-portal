import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE_TOKEN = new InjectionToken<Storage>('local-storage');

export function localStorageFactory(): Storage {
  return localStorage;
}
