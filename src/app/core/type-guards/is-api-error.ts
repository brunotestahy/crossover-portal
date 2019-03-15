import { ApiError } from 'app/core/models/error';

export function isApiError(value: {
  error?: {
    errorCode?: string,
    type?: string,
    httpStatus?: number,
    text?: string,
  },
  status?: number
}): value is ApiError {
  const result: boolean =
    !!value &&
    !!value.error &&
    !!value.error.errorCode &&
    !!value.error.type &&
    !!value.error.httpStatus &&
    !!value.error.text;
  return result;
}
