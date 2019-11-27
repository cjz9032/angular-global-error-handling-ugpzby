import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { SecureMath } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-battery-charge-threshold-settings',
	templateUrl: './battery-charge-threshold-settings.component.html',
	styleUrls: ['./battery-charge-threshold-settings.component.scss']
})
export class BatteryChargeThresholdSettingsComponent implements OnInit {
	@Input() title = '';
	@Input() start = '';
	@Input() stop = '';
	@Input() checkboxText = '';
	@Input() type = 'primary';
	@Input() displayNoteOnly = false;
	@Input() showWarningMsg: any;
	@Input() startAtChargeOptions: any;
	@Input() stopAtChargeOptions: any;
	@Input() selectedStartAtCharge: any;
	@Input() selectedStopAtCharge: any;
	@Input() isCheckedAuto: any;
	@Output() sendBatteryDetails = new EventEmitter();
	@Output() autoChecked = new EventEmitter<boolean>();
	@Input() textId = '';
	@Input() isGaugeResetRunning = false;



	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * SecureMath.random());

	/** Input fields names */
	startChargeInput = 'startAtCharge';
	stopAtChargeInput = 'stopAtCharge';
	isCheckedAutoInput = 'isCheckedAuto';
	public selectedOptionsData: any = {};

	constructor() { }

	ngOnInit() { }

	onChargeChange(id: string, newCharge: number, event: Event) {
		if (id === this.startChargeInput) {
			if (this.selectedStartAtCharge !== newCharge) {
				this.selectedStartAtCharge = newCharge;
			}
		} else {
			if (this.selectedStopAtCharge !== newCharge) {
				this.selectedStopAtCharge = newCharge;

				if (this.isCheckedAuto) {
					this.autoStartStopAtCharge();
				}
			}

		}
		if (!this.isCheckedAuto) {
			this.selectedOptionsData = {
				startValue: this.selectedStartAtCharge,
				stopValue: this.selectedStopAtCharge,
				checkBoxValue: this.isCheckedAuto
			};
			this.sendBatteryDetails.emit(this.selectedOptionsData);
		} else {
			this.toggleAutoChargeSettings(true);
		}

	}

	autoStartStopAtCharge() {
		this.selectedStartAtCharge = this.selectedStopAtCharge - 5;
	}

	public toggleAutoChargeSettings(event: any) {
		this.autoStartStopAtCharge();
		this.selectedOptionsData = {
			startValue: this.selectedStartAtCharge,
			stopValue: this.selectedStopAtCharge,
			checkBoxValue: this.isCheckedAuto
		};
		this.autoChecked.emit(this.selectedOptionsData);
	}
}
