# angular-recaptcha3
Angular v6+ integration with google recaptcha (version 2-3)

## Setup
```typescript
const RECAPTCHA_OPTION = {
    language?: string;
    invisible?: IRecaptchaOption;
    normal?: IRecaptchaOption;
}

interface IRecaptchaOption {
    sitekey: string;
    theme?: string;
    type?: string;
    tabindex?: number;
    badge?: string;
}
```
Option description: https://developers.google.com/recaptcha/docs/display

Language codes: https://developers.google.com/recaptcha/docs/language

```typescript
import { ReCaptchaModule } from 'angular-recaptcha3';

@NgModule({
    imports: [
        ReCaptchaModule.forRoot(RECAPTCHA_OPTION)
    ]
})
```

Example AppModule:

```typescript
import { ReCaptchaModule } from 'angular-recaptcha3';

@NgModule({
    imports: [
        ReCaptchaModule.forRoot({
            invisible: {
                sitekey: 'your key', 
            },
            normal: {
                sitekey: 'your key', 
            },
            language: 'en'
        }),
    ]
})
```

To initialize the recaptcha you need to insert in the template
```html
<recaptcha 
    [size]="'invisible'"
    (captchaResponse)="onCaptchaResponse($event)"
    (captchaExpired)="onCaptchaExpired()">
</recaptcha>

<recaptcha 
    [size]="'normal'"
    [hide]="false" 
    (captchaResponse)="onCaptchaResponse($event)">
</recaptcha>
```

```typescript
onCaptchaExpired(event) {
    console.log(event);
}

onCaptchaResponse(event) {
    console.log(event);
}
```

Recaptcha has parametrs:
- hide
- sitekey
- size
- theme
- type
- tabindex
- badge
- language

## Actions
reCAPTCHA v3 introduces a new concept: actions. When you specify an action name in each place you execute reCAPTCHA you enable two new features:

a detailed break-down of data for your top ten actions in the admin console
adaptive risk analysis based on the context of the action (abusive behavior can vary)
Importantly, when you verify the reCAPTCHA response you should also verify that the action name matches the one you expect.

```
    constructor(
        private recaptchaService: ReCaptchaService
    ) { }
    // ...
    recaptchaService.execute({action: 'homepage'}).then(token => {
        //...
    });
```
Note: actions may only contain alphanumeric characters and slashes, and must not be user-specific.

A more detailed description of ReCaptcha:
https://developers.google.com/recaptcha/intro