import { HttpErrorResponse } from '@angular/common/http';

export class ParsedError {
  constructor(
    public errorCode: string,
    public httpStatus: number,
    public text: string,
    public type: string
  ) {
  }

  public static from(error: Partial<ParsedError>): ParsedError {
    if (error instanceof ParsedError) {
      return error;
    }
    return new ParsedError (
      error.errorCode as typeof ParsedError.prototype.errorCode,
      error.httpStatus as typeof ParsedError.prototype.httpStatus,
      error.text as typeof ParsedError.prototype.text,
      error.type as typeof ParsedError.prototype.type
    );
  }

  public static fromHttpError(response: Partial<HttpErrorResponse>): ParsedError {
    const error = response.error || new ParsedError(
      response.statusText as typeof HttpErrorResponse.prototype.statusText,
      response.status as typeof HttpErrorResponse.prototype.status,
      response.message as typeof HttpErrorResponse.prototype.message,
      response.name as typeof HttpErrorResponse.prototype.name
    );
    return ParsedError.from(error);
  }
}
