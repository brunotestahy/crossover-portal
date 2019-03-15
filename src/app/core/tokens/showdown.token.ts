import { InjectionToken } from '@angular/core';
import * as showdown from 'showdown';

export const SHOWDOWN_CONVERTER_TOKEN = new InjectionToken<showdown.Converter>('showdown.converter');

