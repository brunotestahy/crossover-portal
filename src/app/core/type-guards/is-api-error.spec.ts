import { ApiError } from 'app/core/models/error';

import { isApiError } from './is-api-error';

describe('isApiError', () => {
  it('should return true for a correct error structure', () => {
    const error: ApiError = {
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
        text: 'Invalid email and/or password!',
      },
    };
    expect(isApiError(error)).toBe(true);
  });

  it('should return false for an error like structure with some missing filed', () => {
    const missingCode = Object.assign({
      error: {
        httpStatus: 400,
        type: 'ERROR',
        text: 'Invalid email and/or password!',
      },
    }) as ApiError;
    const missingStatus =  Object.assign({
      error: {
        errorCode: 'CROS-0027',
        type: 'ERROR',
        text: 'Invalid email and/or password!',
      },
    }) as ApiError;
    const missingText = Object.assign({
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
      },
    }) as ApiError;
    const missingType: ApiError = Object.assign({
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        text: 'Invalid email and/or password!',
      },
    }) as ApiError;
    expect(isApiError(missingCode)).toBe(false);
    expect(isApiError(missingStatus)).toBe(false);
    expect(isApiError(missingText)).toBe(false);
    expect(isApiError(missingType)).toBe(false);
  });

  it('should return false a non error like structure', () => {
    const nonApiErrorObject = Object.assign({ some: 'some' }) as ApiError;
    expect(isApiError(nonApiErrorObject)).toBe(false);
  });
});
