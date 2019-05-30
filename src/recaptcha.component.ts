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

import { IRecaptchaOptionType } from './models/recaptcha-option-type.interface';
import { RECAPTCHA_OPTION } from './recaptch.tokens';
import { ReCaptchaService } from './recaptcha.service';

@Component({
    selector: 'recaptcha',
    template: `
        <div #target
            [ngClass]="{'hide': hide}"
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
    @Input() hide: boolean = true;

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

        @Inject(RECAPTCHA_OPTION) private option: IRecaptchaOptionType,
    ) {
        option = option || {
            language: 'ru',
            invisible: {
                sitekey: this.sitekey || undefined,
                theme: 'light',
                type: 'image',
                tabindex: 0,
                badge: 'bottomright'
            },
        };
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
        this._captchaService.getReady(this.language || this.option.language)
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
            'sitekey': this.getSiteKey(),
            'badge': this.getBadge(),
            'theme': this.getTheme(),
            'type': this.getType(),
            'tabindex': this.getTabindex(),
            'size': this.size || 'invisible',
            'callback': <any>((response: any) => this._zone.run(this.recaptchaCallback.bind(this, response))),
            'expired-callback': <any>(() => this._zone.run(this.recaptchaExpiredCallback.bind(this)))
        });
    }

    public execute(options: any = undefined) {
        if (this.size !== 'invisible') {
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

    private getSiteKey() {
        if (this.sitekey) {
            return this.sitekey;
        }

        if (this.size === 'invisible') {
            return this.option.invisible.sitekey;
        }

        if (this.size === 'normal') {
            return this.option.normal.sitekey;
        }

        throw new Error('Invalid sitekey');
    }

    private getBadge() {
        if (this.badge) {
            return this.badge;
        }

        if (this.size === 'invisible') {
            return this.option.invisible.badge;
        }

        if (this.size === 'normal') {
            return this.option.normal.badge;
        }

        return 'bottomright';
    }

    private getTheme() {
        if (this.theme) {
            return this.theme;
        }

        if (this.size === 'invisible') {
            return this.option.invisible.theme;
        }

        if (this.size === 'normal') {
            return this.option.normal.theme;
        }

        return 'light';
    }

    private getType() {
        if (this.type) {
            return this.type;
        }

        if (this.size === 'invisible') {
            return this.option.invisible.type;
        }

        if (this.size === 'normal') {
            return this.option.normal.type;
        }

        return 'image';
    }

    private getTabindex() {
        if (this.tabindex) {
            return this.tabindex;
        }

        if (this.size === 'invisible') {
            return this.option.invisible.tabindex;
        }

        if (this.size === 'normal') {
            return this.option.normal.tabindex;
        }

        return 0;
    }
}
