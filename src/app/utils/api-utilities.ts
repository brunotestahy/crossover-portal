import { isApiError } from 'app/core/type-guards/is-api-error';

export function decodeErrorMessage(error: { error: { text: string } } | { status: number }, defaultMessage: string): string {
  if (isApiError(error)) {
    return error.error.text;
  } else if ((error as { status: number }).status === 0) {
    return 'Sorry, unknown error happened! Please try again later or contact support.';
  }
  return defaultMessage;
}
