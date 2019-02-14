import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	Input,
	HostListener,
	SimpleChanges,
	OnChanges
} from '@angular/core';

@Component({
	selector: 'vtr-battery-indicator',
	templateUrl: './battery-indicator.component.html',
	styleUrls: ['./battery-indicator.component.scss']
})
export class BatteryIndicatorComponent implements OnInit, OnChanges {
	private cssStyleDeclaration: CSSStyleDeclaration;

	@ViewChild('battery') battery: ElementRef;
	@ViewChild('batteryIndicator') batteryIndicator: ElementRef;

	@Input() isCharging = true; // boolean indicator if its changing or not
	@Input() percentage = 0; // number without % symbol
	@Input() remainingHour = 0; // number of hours remaining
	@Input() remainingMinutes = 0; // number of minutes remaining

	constructor() {}

	ngOnInit() {
		this.getCssDeclaration();
		this.refreshLevel();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
		if (changes['percentage'] && !changes['percentage'].firstChange) {
			this.refreshLevel();
		}
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
			fillWidth = 100;
		if (this.percentage > 0 && this.percentage <= 100) {
			level = this.percentage / 100;
			fillWidth = this.percentage;
		}

		const {
			borderColor,
			backgroundColor,
			fillColor
		} = this.getLevelCssValues(this.percentage);

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

	getLevelCssValues(level: number): any {
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

	getTimeRemaining(): string {
		const hours =
			this.remainingHour > 0 && this.remainingHour < 2 ? 'hour' : 'hours';
		const minutes =
			this.remainingHour > 0 && this.remainingHour < 2
				? 'minute'
				: 'minutes';
		return `${this.remainingHour} ${hours} ${
			this.remainingMinutes
		} ${minutes}`;
	}

	// returns windows object
	getCssPropertyValue(propertyName: string): string {
		if (this.cssStyleDeclaration) {
			return this.cssStyleDeclaration.getPropertyValue(propertyName);
		}
		return '';
	}

	getCssDeclaration() {
		this.cssStyleDeclaration = window.getComputedStyle(
			this.batteryIndicator.nativeElement
		);
	}
}
