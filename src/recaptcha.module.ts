import { ModuleWithProviders, NgModule } from '@angular/core';

import { ReCaptchaComponent } from './recaptcha.component';
import { RECAPTCHA_LANGUAGE, RECAPTCHA_OPTION } from './recaptch.tokens';
import { RECAPTCHA_SERVICE_PROVIDER } from './recaptcha.service';

@NgModule({
    declarations: [ReCaptchaComponent],
    exports: [ReCaptchaComponent],
    providers: [RECAPTCHA_SERVICE_PROVIDER]
})

export class ReCaptchaModule {
    static forRoot(option: any = undefined, lang: string = undefined): ModuleWithProviders {
        return {
            ngModule: ReCaptchaModule,
            providers: [
                {
                    provide: RECAPTCHA_OPTION,
                    useValue: option
                },
                {
                    provide: RECAPTCHA_LANGUAGE,
                    useValue: lang
                }
            ]
        };
    }
}
