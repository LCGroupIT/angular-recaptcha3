import { InjectionToken } from '@angular/core';

import { IRecaptchaOptionType } from './models/recaptcha-option-type.interface';

export const RECAPTCHA_OPTION = new InjectionToken<IRecaptchaOptionType>('RECAPTCHA_OPTION');
