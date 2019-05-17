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

	@ViewChild('battery') battery: ElementRef;
	@ViewChild('batteryIndicator') batteryIndicator: ElementRef;

	@Input() isVoltageError = false; // boolean indicator if its changing or not
	@Input() isCharging = true; // boolean indicator if its changing or not
	@Input() isExpressCharging = true; // boolean indicator if its express changing or not
	@Input() percentage = 50; // number without % symbol
	@Input() remainingHour = 0; // number of hours remaining
	@Input() remainingMinutes = 0; // number of minutes remaining
	@Input() timeText = "";

	constructor(public translate: TranslateService) {
	}

	ngOnInit() {
		this.getCssDeclaration();
		this.refreshLevel();
		this.checkRemainingTimeIsZero();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['percentage'] && !changes['percentage'].firstChange) {
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
	 * based on decimal value its fills battery acid level
	 * @param level decimal value ranging from 0.0 to 1.0
	 */
	refreshLevel() {
		let level = 1,
			fillWidth = 0;
		let percentage = this.percentage;

		if (this.isVoltageError) {
			percentage = 0;
		}

		if (percentage > 0 && percentage <= 100) {
			level = percentage / 100;
			fillWidth = percentage;
		}
		const {
			borderColor,
			backgroundColor,
			fillColor
		} = this.getLevelCssValues(percentage);

		this.batteryIndicator.nativeElement.style.setProperty(
			'--background-color',
			backgroundColor
		);

		this.batteryIndicator.nativeElement.style.setProperty(
			'--border-color',
			borderColor
		);
		this.batteryIndicator.nativeElement.style.setProperty(
			'--acid-fill-gradient',
			fillColor
		);

		this.batteryIndicator.nativeElement.style.setProperty(
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
		let backgroundColor = '';
		let fillColor = '';

		switch (true) {
			case level >= 0 && level < 15: // red status
				borderColor = this.getCssPropertyValue('--border-color-0-14');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-0-14'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-0-14'
				);
				break;
			case level >= 15 && level < 25: // Yellow
				borderColor = this.getCssPropertyValue('--border-color-15-24');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-15-24'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-15-24'
				);
				break;
			case level >= 25: // green
				borderColor = this.getCssPropertyValue('--border-color-25-100');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-25-100'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-25-100'
				);
				break;
			default:
				// -1 for battery error
				borderColor = this.getCssPropertyValue('--border-color-error');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-error'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-error'
				);
				break;
		}

		return { borderColor, backgroundColor, fillColor };
	}

	public getTimeRemaining(): string {
		this.checkRemainingTimeIsZero();
		if (Number.isNaN(this.remainingMinutes)) {
			return "";
		}
		const hours =
			this.remainingHour > 0 && this.remainingHour < 2 ? this.translate.instant('device.deviceSettings.batteryGauge.hour') : this.translate.instant('device.deviceSettings.batteryGauge.hours');
		const minutes =
			this.remainingMinutes > 0 && this.remainingMinutes < 2
				? this.translate.instant('device.deviceSettings.batteryGauge.minute')
				: this.translate.instant('device.deviceSettings.batteryGauge.minutes');
		if(this.remainingHour == 0) {
			return `${this.remainingMinutes} ${minutes}`;
		}
		return `${this.remainingHour} ${hours} ${
			this.remainingMinutes
			} ${minutes}`;
	}

	checkRemainingTimeIsZero() {
		let isZero = false;
		if (Number.isNaN(this.remainingMinutes)) {
			this.hideRemainingTimeTxt = true
			return;
		}
		if(this.remainingHour == 0) {
			if (this.remainingMinutes == 0) {
				this.hideRemainingTimeTxt = true
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
			this.batteryIndicator.nativeElement
		);
	}
}
