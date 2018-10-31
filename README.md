# angular-recaptcha3
Angular v6+ integration with google recaptcha v3

## Setup
Setup example:
```typescript
const RECAPTCHA_OPTION = {
      key: 'test-key',
      size: 'invisible',
      theme: 'light',
      type: 'image',
      tabindex: 0,
      badge: 'bottomright',
      language: 'ru',
      show: true
}
```
Option description: https://developers.google.com/recaptcha/docs/display
```typescript
const RECAPTCHA_LANGUAGE = 'ru'
```
Language codes: https://developers.google.com/recaptcha/docs/language

```typescript
@NgModule({
    imports: [
        ReCaptchaModule.forRoot(RECAPTCHA_OPTION, RECAPTCHA_LANGUAGE)
    ]
})
```

To initialize the recaptcha you need to insert in the template
```html
    <recaptcha
        [show]="false">
    </recaptcha>
```
Recaptcha has parametrs:
- show
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