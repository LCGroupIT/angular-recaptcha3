import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Injectable,
    Input,
    NgZone,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RECAPTCHA_LANGUAGE, RECAPTCHA_OPTION } from './recaptch.tokens';
import { ReCaptchaService } from './recaptcha.service';

@Component({
    selector: 'recaptcha',
    template: `
        <div #target
            [ngClass]="{'hide': onHideCaptcha()}"
            [class]="'recaptcha g-recaptcha ' + (size || 'invisible')"
            [id]="widgetId">
        </div>
    `,
    styles: [`
        .hide {
            display: none;
        }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ReCaptchaComponent),
            multi: true
        }
    ]
})
@Injectable()
export class ReCaptchaComponent implements OnInit, ControlValueAccessor {
    @Input() sitekey: string;
    @Input() size: string;
    @Input() theme: string;
    @Input() type: string;
    @Input() tabindex: number;
    @Input() badge: string;
    @Input() language: string;
    @Input() show: boolean;

    @Output() captchaResponse = new EventEmitter<string>();
    @Output() captchaExpired = new EventEmitter();

    @ViewChild('target') targetRef: ElementRef;
    widgetId: any = null;

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    onChange: Function = () => {};
    onTouched: Function = () => {};


    constructor(
        private _zone: NgZone,
        private _captchaService: ReCaptchaService,

        @Inject(RECAPTCHA_OPTION) private option: any,
        @Inject(RECAPTCHA_LANGUAGE) private lang: string
    ) {
        option = option || {
            size: 'invisible',
            theme: 'light',
            type: 'image',
            tabindex: 0,
            badge: 'bottomright',
            language: 'ru',
            show: true
        };
        lang = lang || 'ru';
    }

    ngOnInit() {
        this.setWidgetId();
    }

    public reset() {
        if (this.widgetId === null) {
            return;
        }
        this.grecaptchaReset();
        this.onChange(null);
    }

    public setWidgetId() {
        this._captchaService.getReady(this.language || this.lang)
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((ready) => {
                if (!ready) {
                    return;
                }
                this.widgetId = this.render(this.targetRef.nativeElement);
            });
    }

    public render(target) {
        return (<any>window).grecaptcha.render(target, {
            'sitekey': this.sitekey || this.option.sitekey,
            'badge': this.badge || this.option.badge || 'bottomright',
            'theme': this.theme || this.option.theme || 'light',
            'type': this.type || this.option.type || 'image',
            'size': this.size || this.option.size || 'invisible',
            'tabindex': this.tabindex || this.option.tabindex || 0,
            'callback': <any>((response: any) => this._zone.run(this.recaptchaCallback.bind(this, response))),
            'expired-callback': <any>(() => this._zone.run(this.recaptchaExpiredCallback.bind(this)))
        });
    }

    public execute(options: any = undefined) {
        if (this.size !== 'invisible' || this.option.size !== 'invisible') {
            return;
        }

        if (this.widgetId === null) {
            throw new Error('Invalid widgetId');
        }
        return (<any>window).grecaptcha.execute(this.widgetId, options);
    }

    public getResponse(): string {
        if (this.widgetId === null) {
            throw new Error('Invalid widgetId');
        }
        return (<any>window).grecaptcha.getResponse(this.widgetId);
    }

    writeValue(newValue: any): void {
        /* ignore it */
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onHideCaptcha(): boolean {
        return !this.show && this.option.size === 'invisible';
    }

    ngOnDestroy(): void {
        this.grecaptchaReset();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private recaptchaCallback(response: string) {
        this.onChange(response);
        this.onTouched();
        this.captchaResponse.emit(response);
    }

    private recaptchaExpiredCallback() {
        this.onChange(null);
        this.onTouched();
        this.captchaExpired.emit();
    }

    private grecaptchaReset() {
        if (this.widgetId != null) {
          this._zone.runOutsideAngular(() => (<any>window).grecaptcha.reset(this.widgetId));
        }
      }
}
