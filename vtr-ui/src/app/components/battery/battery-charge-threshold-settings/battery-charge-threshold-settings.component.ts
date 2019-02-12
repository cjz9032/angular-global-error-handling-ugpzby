import { Component, OnInit, Input, ViewChild, HostBinding, HostListener, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'vtr-battery-charge-threshold-settings',
	templateUrl: './battery-charge-threshold-settings.component.html',
	styleUrls: ['./battery-charge-threshold-settings.component.scss']
})
export class BatteryChargeThresholdSettingsComponent implements OnInit {
	@Input() title: string = this.title || '';
	@Input() type: string = this.type || 'primary';
	@Input() displayNoteOnly: boolean = this.displayNoteOnly || false;
	isCheckedAuto: boolean = this.isCheckedAuto || false;

	chargeOptions = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	selStopAtCharge = this.selStopAtCharge || 75;
	selStartAtCharge = this.selStartAtCharge || 40;
	startAtChargeOptions = this.chargeOptions.slice(0, this.chargeOptions.length - 1); //
	stopAtChargeOptions = this.chargeOptions.slice(1, this.chargeOptions.length);

	/** unique batttery id is generated to have unique input field for multiple instance of same component used */
	uid = Math.floor(new Date().valueOf() * Math.random()); // new Date().getUTCMilliseconds();

	/** Input fields names */
	startChargeInput = 'startAtCharge';
	stopAtChargeInput = 'stopAtCharge';
	isCheckedAutoInput = 'isCheckedAuto';

	// selectedValue:number=25;

	constructor(private _el: ElementRef) { }

	ngOnInit() {
	}


	onChargeChange(id: string, newCharge: number, event: Event) {
		console.log('onChargeChange' + event + '\n' + id + '\n' + newCharge);
		if (this.isCheckedAuto) {
			this.autoStartStopAtCharge();
		}

		if (id === this.startChargeInput) {
			if (this.selStartAtCharge !== newCharge) {
				console.log('values got changed for selStartAtCharge ');
				this.selStartAtCharge = newCharge;
			}
		} else {
			if (this.selStopAtCharge !== newCharge) {
				console.log('values got changed for selStopAtCharge ');
				this.selStopAtCharge = newCharge;
			}

		}

	}


	autoStartStopAtCharge() {
		this.selStartAtCharge = this.selStopAtCharge - 5;

	}

	toggleAutoChargeSettings(event: Event) {
		console.log('toggleAutoSettings');
		if (event) {
			this.autoStartStopAtCharge();
		}

	}
}
