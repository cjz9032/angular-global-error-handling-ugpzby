import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
	selector: 'vtr-battery-indicator',
	templateUrl: './battery-indicator.component.html',
	styleUrls: ['./battery-indicator.component.scss']
})
export class BatteryIndicatorComponent implements OnInit {
	@ViewChild('battery') battery: ElementRef;
	@ViewChild('batteryShadow') batteryShadow: ElementRef;
	@ViewChild('acidLevel') acidLevel: ElementRef;

	@Input() percentage = 0;
	@Input() remainingHour = 0;
	@Input() remainingMinutes = 0;

	constructor() {}

	ngOnInit() {
		this.refreshLevel(0.5);

		this.battery.nativeElement.style.setProperty(
			'--background-color',
			'#f17f14'
		);
		this.batteryShadow.nativeElement.style.setProperty(
			'--background-color',
			'#f17f14'
		);
		this.battery.nativeElement.style.setProperty(
			'--border-color',
			'rgba(241, 127, 20, 0.4)'
		);
		this.batteryShadow.nativeElement.style.setProperty(
			'--border-color',
			'rgba(241, 127, 20, 0.4)'
		);
		this.acidLevel.nativeElement.style.setProperty(
			'--acid-fill-gradient',
			'linear-gradient(302.26deg, #f17f14 0%, #ed4e04 100%)'
		);
	}

	/**
	 * based on decimal value its fills battery acid level
	 * @param level decimal value ranging from 0.0 to 1.0
	 */
	refreshLevel(level: number) {
		this.acidLevel.nativeElement.style.setProperty(
			'--acid-height',
			level * this.battery.nativeElement.clientWidth + 'px'
		);
	}

	getTimeRemaining() {
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
}
