import { AuthTokenService } from './auth-token.service';

describe('AuthTokenService', () => {
    let service: AuthTokenService;
    let storage: Storage;

    beforeEach(() => {
        storage = Object.assign({
          getItem: () => {},
          setItem: () => {},
          removeItem: () => {},
        });
        service = new AuthTokenService(storage);
    });

    it('should retrieve token from "xo_token" key', () => {
      const tokenSpy = spyOn(storage, 'getItem').and.returnValue('a-token');
      expect(service.getToken()).toBe('a-token');
      expect(tokenSpy).toHaveBeenCalledWith('xo_token');
    });


    it('should return null if token is undefined', () => {
      spyOn(storage, 'getItem').and.returnValue('undefined');
      expect(service.getToken()).toBe(null);
    });

    it('should set the token at the appropriate key', () => {
      const setItemSpy = spyOn(storage, 'setItem');
      service.setToken('abc');
      expect(setItemSpy).toHaveBeenCalledWith('xo_token', 'abc');
    });

    it('should remove the token from the appropriate key', () => {
      const removeItemSpy = spyOn(storage, 'removeItem');
      service.removeToken();
      expect(removeItemSpy).toHaveBeenCalledWith('xo_token');
    });

});
