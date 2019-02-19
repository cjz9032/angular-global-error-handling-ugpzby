import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
	selector: 'vtr-battery-charge-threshold-settings',
	templateUrl: './battery-charge-threshold-settings.component.html',
	styleUrls: ['./battery-charge-threshold-settings.component.scss']
})
export class BatteryChargeThresholdSettingsComponent implements OnInit {
	@Input() title = '';
	@Input() type = 'primary';
	@Input() displayNoteOnly: boolean = this.displayNoteOnly || false;

	isCheckedAuto: boolean = this.isCheckedAuto || false;
	selectedStopAtCharge: number = this.selectedStopAtCharge || 75;
	selectedStartAtCharge: number = this.selectedStartAtCharge || 40;

	chargeOptions: number[] = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	startAtChargeOptions: number[] = this.chargeOptions.slice(0, this.chargeOptions.length - 1);
	stopAtChargeOptions: number[] = this.chargeOptions.slice(1, this.chargeOptions.length);

	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * Math.random());

	/** Input fields names */
	startChargeInput = 'startAtCharge';
	stopAtChargeInput = 'stopAtCharge';
	isCheckedAutoInput = 'isCheckedAuto';

	constructor() { }

	ngOnInit() {
	}

	onChargeChange(id: string, newCharge: number, event: Event) {
		// console.log('onChargeChange' + event + '\n' + id + '\n' + newCharge);

		if (id === this.startChargeInput) {
			if (this.selectedStartAtCharge !== newCharge) {
				// console.log('values got changed for selectedStartAtCharge ');
				this.selectedStartAtCharge = newCharge;
			}
		} else {
			if (this.selectedStopAtCharge !== newCharge) {
				// console.log('values got changed for selectedStopAtCharge ');
				this.selectedStopAtCharge = newCharge;

				if (this.isCheckedAuto) {
					this.autoStartStopAtCharge();
				}
			}
		}
	}

	autoStartStopAtCharge() {
		this.selectedStartAtCharge = this.selectedStopAtCharge - 5;
	}

	toggleAutoChargeSettings(event: Event) {
		// console.log('toggleAutoSettings');
		if (event) {
			this.autoStartStopAtCharge();
		}
	}
}
