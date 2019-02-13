import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
	selector: 'vtr-battery-indicator',
	templateUrl: './battery-indicator.component.html',
	styleUrls: ['./battery-indicator.component.scss']
})
export class BatteryIndicatorComponent implements OnInit {
	private cssStyleDeclaration: CSSStyleDeclaration;

	@ViewChild('battery') battery: ElementRef;
	@ViewChild('batteryIndicator') batteryIndicator: ElementRef;

	@Input() percentage = 0; // number without % symbol
	@Input() remainingHour = 0; // number of hours remaining
	@Input() remainingMinutes = 0; // number of minutes remaining

	constructor() {}

	ngOnInit() {
		this.getCssDeclaration();
		this.refreshLevel();
	}

	/**
	 * based on decimal value its fills battery acid level
	 * @param level decimal value ranging from 0.0 to 1.0
	 */
	refreshLevel() {
		if (this.percentage > 0 && this.percentage <= 100) {
			const level = this.percentage / 100;
			const {
				borderColor,
				backgroundColor,
				fillColor
			} = this.getLevelCssValues(level);

			console.log(level, backgroundColor, borderColor, fillColor);

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
				level * this.battery.nativeElement.clientWidth + 'px'
			);
		}
	}

	getLevelCssValues(level: number): any {
		let borderColor = '';
		let backgroundColor = '';
		let fillColor = '';

		switch (true) {
			case level < 0.2:
				borderColor = this.getCssPropertyValue('--border-color-0-20');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-0-20'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-0-20'
				);
				break;
			case level < 0.4:
				borderColor = this.getCssPropertyValue('--border-color-21-40');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-21-40'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-21-40'
				);
				break;
			case level < 0.6:
				borderColor = this.getCssPropertyValue('--border-color-41-60');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-41-60'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-41-60'
				);
				break;
			case level < 0.8:
				borderColor = this.getCssPropertyValue('--border-color-61-80');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-61-80'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-61-80'
				);
				break;
			case level < 1:
				borderColor = this.getCssPropertyValue('--border-color-81-100');
				backgroundColor = this.getCssPropertyValue(
					'--background-color-81-100'
				);
				fillColor = this.getCssPropertyValue(
					'--acid-fill-gradient-81-100'
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
		return this.cssStyleDeclaration.getPropertyValue(propertyName);
	}

	getCssDeclaration() {
		this.cssStyleDeclaration = window.getComputedStyle(
			this.batteryIndicator.nativeElement
		);
	}
}
