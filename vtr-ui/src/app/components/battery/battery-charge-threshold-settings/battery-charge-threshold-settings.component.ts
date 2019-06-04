import { Component, OnInit, Input, ElementRef,Output, EventEmitter} from '@angular/core';

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
	@Input() displayNoteOnly: boolean = this.displayNoteOnly || false;
	@Input() startAtChargeOptions: any;
	@Input() stopAtChargeOptions: any;
	@Input() selectedStartAtCharge: any;
	@Input() selectedStopAtCharge: any;
	@Input() isCheckedAuto: any;
	@Output() sendBatteryDetails = new EventEmitter();
	@Output() autoChecked = new EventEmitter<boolean>()

	

	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * Math.random());

	/** Input fields names */
	startChargeInput = 'startAtCharge';
	stopAtChargeInput = 'stopAtCharge';
	isCheckedAutoInput = 'isCheckedAuto';
	public selectedOptionsData: any = {};

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
		// Battery num is static need to change 
		this.selectedOptionsData = {
			startChargeValue : this.selectedStartAtCharge,
			stopChargeValue : this.selectedStopAtCharge,
			autoChecked: this.isCheckedAuto,
			batteryNum: 1
		}
		this.sendBatteryDetails.emit(this.selectedOptionsData)
	}

	autoStartStopAtCharge() {
		this.selectedStartAtCharge = this.selectedStopAtCharge - 5;
	}

	toggleAutoChargeSettings(event: Event) {
		// console.log('toggleAutoSettings');
		if (event) {
			this.autoStartStopAtCharge();
			this.autoChecked.emit(true)
		}
	}
}
