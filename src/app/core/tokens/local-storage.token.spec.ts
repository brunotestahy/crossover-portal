import { localStorageFactory } from 'app/core/tokens/local-storage.token';

describe('localStorageFactory', () => {
  it('should return the global localStorage', () => {
    expect(localStorageFactory()).toBe(localStorage);
  });
});
