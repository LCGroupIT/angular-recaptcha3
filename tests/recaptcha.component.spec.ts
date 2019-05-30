import { forwardRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import * as RecaptchaTokens from '../src/recaptch.tokens';
import { ReCaptchaComponent } from '../src/recaptcha.component';
import { RECAPTCHA_SERVICE_PROVIDER, ReCaptchaService } from '../src/recaptcha.service';

describe('ReCaptchaComponent', () => {
  let component: ReCaptchaComponent;
  let fixture: ComponentFixture<ReCaptchaComponent>;
  const option = {
    invisible: {
        sitekey: '6Ld4AGIUAAAAACOL56rkJOa8LHgkq4uNgmnERLJY',
        size: 'invisible',
        theme: 'light',
        type: 'image',
        tabindex: 0,
        badge: 'bottomright',
    },
    language: 'ru'
  };

  beforeEach(async(() => {
      TestBed.configureTestingModule({
          declarations: [ ReCaptchaComponent ],
          providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ReCaptchaComponent),
                multi: true
            },
            ReCaptchaService,
            RECAPTCHA_SERVICE_PROVIDER,
            {
                provide: RecaptchaTokens.RECAPTCHA_OPTION,
                useValue: option
            }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(ReCaptchaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create the component', () => {
      expect(component).toBeTruthy();
  });
});
