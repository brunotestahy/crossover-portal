
import { decodeErrorMessage } from './api-utilities';

describe('api-utilities', () => {
  describe('decodeErrorMessage', () => {
    it('should handle unknown api error', () => {
      const error = { status: 0 };
      expect(decodeErrorMessage(error, 'default message')).toBe(
        'Sorry, unknown error happened! Please try again later or contact support.'
      );
    });
  });
});
