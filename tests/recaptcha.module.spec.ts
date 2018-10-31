import { inject, TestBed, ComponentFixture, async } from '@angular/core/testing';

import { ReCaptchaComponent } from '../src/recaptcha.component';
import * as RecaptchaTokens from '../src/recaptch.tokens';
import { RECAPTCHA_SERVICE_PROVIDER, ReCaptchaService } from '../src/recaptcha.service';


describe('ReCaptchaModule', () => {
    let component: ReCaptchaComponent;
    let fixture: ComponentFixture<ReCaptchaComponent>;

    const lang: string = 'ru';

    const option = {
        key: '6Ld4AGIUAAAAACOL56rkJOa8LHgkq4uNgmnERLJY',
        size: 'invisible',
        theme: 'light',
        type: 'image',
        tabindex: 0,
        badge: 'bottomright',
        language: 'ru',
        show: true
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReCaptchaComponent],
            providers: [
                ReCaptchaService,
                RECAPTCHA_SERVICE_PROVIDER,
                {
                    provide: RecaptchaTokens.RECAPTCHA_OPTION,
                    useValue: option
                },
                {
                    provide: RecaptchaTokens.RECAPTCHA_LANGUAGE,
                    useValue: lang
                }
            ]
        });
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(ReCaptchaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create the service', inject([ReCaptchaService], (service: ReCaptchaService) => {
        expect(service).toBeTruthy();
    }));

    it('should be getReadyModule', inject([ReCaptchaService], (service: ReCaptchaService, done: DoneFn) => {
        service.getReady(lang).subscribe(ready => {
            if (ready) {
                const action = {action: 'test'};

                expect(service.execute(action) && component.widgetId).toBeTruthy();
                done();
            }
        });
    }));
});
