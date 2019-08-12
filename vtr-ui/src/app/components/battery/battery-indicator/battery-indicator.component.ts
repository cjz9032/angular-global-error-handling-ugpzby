import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	Input,
	HostListener,
	SimpleChanges,
	OnChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';

@Component({
	selector: 'vtr-battery-indicator',
	templateUrl: './battery-indicator.component.html',
	styleUrls: ['./battery-indicator.component.scss']
})
export class BatteryIndicatorComponent implements OnInit, OnChanges {
	private cssStyleDeclaration: CSSStyleDeclaration;

	public fillWidth = 0;
	public fillStartColor = '#ff0000';
	public fillEndColor = '#00ff00';
	hideRemainingTimeTxt = false;

	@ViewChild('battery', { static: true }) battery: ElementRef;
	@ViewChild('batteryIndicatorRef', { static: true }) batteryIndicatorRef: ElementRef;

	// @Input() isCharging = true; // boolean indicator if its changing or not
	// @Input() isExpressCharging = true; // boolean indicator if its express changing or not
	// @Input() percentage = 50; // number without % symbol
	// @Input() remainingHour = 0; // number of hours remaining
	// @Input() remainingMinutes = 0; // number of minutes remaining
	// @Input() timeText = '';
	// @Input() batteryNotDetected = false;
	// @Input() isAirplaneMode = false;
	// @Input() isChargeThresholdOn = false;

	@Input() batteryIndicator = new BatteryIndicator();

	constructor(public translate: TranslateService) {
	}

	ngOnInit() {
		this.setBatteryIndicator();
		this.getCssDeclaration();
		this.refreshLevel();
		this.checkRemainingTimeIsZero();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.percentage && !changes.percentage.firstChange) {
			this.refreshLevel();
		}
		this.checkRemainingTimeIsZero();
	}

	// Note : when page is resized, battery fill is not showing correctly.
	// need to recalculate width based on page size
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.refreshLevel();
	}

	/**
	 * sets values of battery indicator data
	 */
	setBatteryIndicator() {
		this.batteryIndicator.batteryNotDetected = this.batteryIndicator.batteryNotDetected || false;
		this.batteryIndicator.charging = this.batteryIndicator.charging || false;
		this.batteryIndicator.expressCharging = this.batteryIndicator.expressCharging;
		this.batteryIndicator.hours = this.batteryIndicator.hours || 0;
		this.batteryIndicator.isAirplaneMode = this.batteryIndicator.isAirplaneMode || false;
		this.batteryIndicator.isChargeThresholdOn = this.batteryIndicator.isChargeThresholdOn || false;
		this.batteryIndicator.minutes = this.batteryIndicator.minutes || 0;
		this.batteryIndicator.percent = this.batteryIndicator.percent || 0;
		this.batteryIndicator.timeText = this.batteryIndicator.timeText || '';
		console.log('Inside set battery indicator', this.batteryIndicator);
	}

	/**
	 * based on decimal value its fills battery acid level
	 * @param level decimal value ranging from 0.0 to 1.0
	 */
	refreshLevel() {
		let level = 1;
		let fillWidth = 0;
		let percentage = this.batteryIndicator.percent;

		if (this.batteryIndicator.batteryNotDetected) {
			percentage = 0;
		}

		if (percentage > 0 && percentage <= 100) {
			level = percentage / 100;
			fillWidth = percentage;
		}
		const {
			borderColor,
			borderShadowColor,
			fillColor
		} = this.getLevelCssValues(percentage);

		this.batteryIndicatorRef.nativeElement.style.setProperty(
			'--border-shadow-color',
			borderShadowColor
		);

		this.batteryIndicatorRef.nativeElement.style.setProperty(
			'--border-color',
			borderColor
		);
		this.batteryIndicatorRef.nativeElement.style.setProperty(
			'--acid-fill-gradient',
			fillColor
		);

		this.batteryIndicatorRef.nativeElement.style.setProperty(
			'--acid-width',
			`calc(${fillWidth}% - 0.85rem)`
		);
	}

	private getLevelCssValues(level: number): any {
		// Green:	RemainTimePercent >= 25%
		// Yellow:	RemainTimePercent  in [15%, 24%]
		// Red:		RemainTimePercent < 15%
		// RedCross with a black background: Battery is error.

		let borderColor = '';
		let borderShadowColor = '';
		let fillColor = '';

		switch (true) {
			case level >= 0 && level < 15: // red status
				borderShadowColor = this.getCssPropertyValue(
					'--border-shadow-color-0-14'
				);
				borderColor = this.getCssPropertyValue(
					'--border-color-0-14'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-0-14'
				);
				break;
			case level >= 15 && level < 25: // Yellow
				borderShadowColor = this.getCssPropertyValue(
					'--border-shadow-color-15-24'
				);
				borderColor = this.getCssPropertyValue(
					'--border-color-15-24'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-15-24'
				);
				break;
			case level >= 25: // green
				borderShadowColor = this.getCssPropertyValue(
					'--border-shadow-color-25-100'
				);
				borderColor = this.getCssPropertyValue(
					'--border-color-25-100'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-25-100'
				);
				break;
			default:
				// -1 for battery error
				borderShadowColor = this.getCssPropertyValue(
					'--border-shadow-color-error'
				);
				borderColor = this.getCssPropertyValue(
					'--border-color-error'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-error'
				);
				break;
		}

		return { borderColor, borderShadowColor, fillColor };
	}

	public getTimeRemaining(): string {
		this.checkRemainingTimeIsZero();
		if (Number.isNaN(this.batteryIndicator.minutes)) {
			return '';
		}
		const hours =
			this.batteryIndicator.hours > 0 && this.batteryIndicator.hours < 2 ? this.translate.instant('device.deviceSettings.batteryGauge.hour') : this.translate.instant('device.deviceSettings.batteryGauge.hours');
		const minutes =
			this.batteryIndicator.minutes > 0 && this.batteryIndicator.minutes < 2
				? this.translate.instant('device.deviceSettings.batteryGauge.minute')
				: this.translate.instant('device.deviceSettings.batteryGauge.minutes');
		if (this.batteryIndicator.hours === 0) {
			return `${this.batteryIndicator.minutes} ${minutes}`;
		}
		return `${this.batteryIndicator.hours} ${hours} ${
			this.batteryIndicator.minutes
			} ${minutes}`;
	}

	checkRemainingTimeIsZero() {
		const isZero = false;
		if (Number.isNaN(this.batteryIndicator.minutes)) {
			this.hideRemainingTimeTxt = true;
			return;
		}
		if (this.batteryIndicator.hours === 0) {
			if (this.batteryIndicator.minutes === 0) {
				this.hideRemainingTimeTxt = true;
			} else {
				this.hideRemainingTimeTxt = false;
			}
			return;
		}
		this.hideRemainingTimeTxt = false;
	}
	// returns windows object
	private getCssPropertyValue(propertyName: string): string {
		if (this.cssStyleDeclaration) {
			return this.cssStyleDeclaration.getPropertyValue(propertyName);
		}
		return '';
	}

	private getCssDeclaration() {
		this.cssStyleDeclaration = window.getComputedStyle(
			this.batteryIndicatorRef.nativeElement
		);
	}
}
