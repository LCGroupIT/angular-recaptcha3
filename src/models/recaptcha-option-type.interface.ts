import { IRecaptchaOption } from './recaptcha-option.interface';

export interface IRecaptchaOptionType {
    language?: string;
    invisible?: IRecaptchaOption;
    normal?: IRecaptchaOption;
}
