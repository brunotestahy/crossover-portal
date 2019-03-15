import { InjectionToken } from '@angular/core';

export const DOCUMENT_TOKEN = new InjectionToken<Document>('document');

export function documentFactory(): Document {
  return document;
}
