import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { IRecaptchaOptionType } from './models/recaptcha-option-type.interface';
import { RECAPTCHA_OPTION } from './recaptch.tokens';
import { ReCaptchaComponent } from './recaptcha.component';
import { RECAPTCHA_SERVICE_PROVIDER } from './recaptcha.service';

@NgModule({
    imports: [CommonModule],
    declarations: [ReCaptchaComponent],
    exports: [ReCaptchaComponent],
    providers: [RECAPTCHA_SERVICE_PROVIDER]
})

export class ReCaptchaModule {
    static forRoot(option: IRecaptchaOptionType = undefined): ModuleWithProviders {
        return {
            ngModule: ReCaptchaModule,
            providers: [
                {
                    provide: RECAPTCHA_OPTION,
                    useValue: option
                }
            ]
        };
    }
}
