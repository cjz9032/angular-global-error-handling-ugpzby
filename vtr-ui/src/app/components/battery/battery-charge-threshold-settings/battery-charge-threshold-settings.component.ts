import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
	@ViewChild('batterySettingsForm') batterySettingsForm: NgForm;
	isCheckedAuto: boolean = this.isCheckedAuto || false;

	chargeOptions = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	selMaxCharge = this.selMaxCharge || 75;
	selMinCharge = this.selMinCharge || 40;
	minChargeOptions = this.chargeOptions.slice(0, this.chargeOptions.length - 1); //
	maxChargeOptions = this.chargeOptions.slice(1, this.chargeOptions.length);


	constructor() { }

	ngOnInit() {
	}

	onMinChargeChange(event: Event) {
		console.log('onMinChargeChange');
		console.log(this.batterySettingsForm);
		if (this.isCheckedAuto) {
			this.setAutoMinCharge();
		}

	}

	onMaxChargeChange(event: Event) {
		console.log('onMaxChargeChange');
		console.log(this.batterySettingsForm);
		if (this.isCheckedAuto) {
			this.setAutoMinCharge();
		}
	}

	setAutoMinCharge() {
		this.selMinCharge = this.selMaxCharge - 5;

	}

	toggleAutoSettings(event: Event) {
		console.log('toggleAutoSettings');
		if (event) {
			this.setAutoMinCharge();
		}

	}
}
