import {
	Component,
	OnInit,
	Input
} from '@angular/core';

import {
	DropDownInterval
} from '../../../../data-models/common/drop-down-interval.model';

import {
	SmartAssistService
} from 'src/app/services/smart-assist/smart-assist.service';


@Component({
	selector: 'vtr-active-protection-system',
	templateUrl: './active-protection-system.component.html',
	styleUrls: ['./active-protection-system.component.scss']
})
export class ActiveProtectionSystemComponent implements OnInit {
	advancedToggle: boolean; // for advanced section toggle
	advanceAvailable: boolean; // show / hide advanced section
	apsStatus: boolean;
	apsSensitivity: number;
	repeatShock: boolean;
	manualSnooze: boolean;
	manualSnoozeTime: number;
	selectedSnoozeTime: number;
	penCapability: boolean;
	touchCapability: boolean;
	pSensorCapability: boolean;
	public intervals: DropDownInterval[];
	// public taskBarDimmerValue: number;

	private populateIntervals() {
		const seconds = 'seconds';
		const minute = 'minute';
		const minutes = 'minutes';

		this.intervals = [{
				name: '30',
				value: 0.5,
				placeholder: seconds,
				text: `30 ${seconds}`
			},
			{
				name: '1',
				value: 1,
				placeholder: minute,
				text: `1 ${minute}`
			},
			{
				name: '2',
				value: 2,
				placeholder: minutes,
				text: `2 ${minutes}`
			},
			{
				name: '3',
				value: 3,
				placeholder: minutes,
				text: `3 ${minutes}`
			}
		];
	}

	toggleAdvanced() {
		this.advancedToggle = !this.advancedToggle;
	}
	constructor(private smartAssist: SmartAssistService) {}

	ngOnInit() {
		this.advancedToggle = false;
		this.populateIntervals();
		this.initAPS(); // get Default or set APS values
		this.checkAdvance(); // checking advanced features
	}

	initAPS() {
		this.smartAssist
			.getAPSMode()
			.then(res => {
				res ? this.apsStatus = true : this.apsStatus = false; 
				console.log('APS IS SET---------------------------------', res);
				this.smartAssist
					.getAPSSensitivityLevel()
					.then(res => {
						switch (res) {
							case 0: {
								this.apsSensitivity = 100;
								break;
							}
							case 1: {
								this.apsSensitivity = 50;
								break;
							}
							case 2: {
								this.apsSensitivity = 0;
								break;
							}
						}
						console.log('APS Sensitivity Level---------------------------------', res);
					});
				this.smartAssist
					.getAutoDisableSetting()
					.then(res => {this.repeatShock = res; console.log('APS Auto Disable Checkbox---------------------------------', res); });
				this.smartAssist
					.getSnoozeSetting()
					.then(res => {
						this.manualSnooze = res; 
						console.log('Manual Sooze Status---------------------------------', res);
						this.smartAssist
							.getSnoozeTime()
							.then(res => {
								console.log('MANUAL SNOOZE TIME --------------------------------- ', res);
								this.manualSnoozeTime = +(res);
							});
					});
			});
	}
	// APS Advanced
	checkAdvance() {
		Promise
			.all([this.smartAssist.getPenCapability(), this.smartAssist.getTouchCapability(), this.smartAssist.getPSensorCapability()])
			.then((res: any[]) => {
				console.log('APS Advanced Status --------------------------------- ', res);
				(res[0] || res[1] || res[2]) ? this.advanceAvailable = true : this.advanceAvailable = true;
				res[0] ? this.penCapability = true : this.penCapability = true;
				res[1] ? this.touchCapability = true : this.touchCapability = true;
				res[2] ? this.pSensorCapability = true : this.pSensorCapability = true;
			})
			.catch(error => console.log('APS Advanced ERROR --------------------------------- ', error));
	}

	// APS FUNCTIONS
	setAPSMode(event) {
		const value = !this.apsStatus;
		this.apsStatus = !this.apsStatus;
		this.smartAssist
			.setAPSMode(value)
			.then(res => console.log('APS SET --------------------------------- ', res));
	}

	setAPSSensitivityLevel(event) {
		let value: number;
		switch (event.value) {
			case 0: {
				value = 2;
				break;
			}
			case 50: {
				value = 1;
				break;
			}
			case 100: {
				value = 0;
				break;
			}
		}
		this.smartAssist
			.setAPSSensitivityLevel(value)
			.then(res => console.log('APS SENSITIVITY LEVEL SET ---------------------------------', value, res));
	}

	setAutoDisableSetting(event) {
		const value = !this.repeatShock;
		this.smartAssist
			.setAutoDisableSetting(value)
			.then(res => console.log('AUTO DISABLE CHECKBOX SET ---------------------------------', res));
	}

	setSnoozeSetting(event) {
		const value = !this.manualSnooze;
		this.manualSnooze = !this.manualSnooze;
		this.smartAssist
			.setSnoozeSetting(value)
			.then(res => console.log('SNOOZE STATUS SET --------------------------------- ', res));
	}

	setSnoozeTime(event: DropDownInterval) {
		this.selectedSnoozeTime = event.value;
		this.smartAssist
			.setSnoozeTime(event.value.toString())
			.then(res => console.log('SNOOZE TIME SET ---------------------------------', event.value, res));
	}

	suspendNow() {
		let timeInSec;
		switch (this.selectedSnoozeTime) {
			case 0.5:
				timeInSec = '30';
				break;
			case 1:
				timeInSec = '60';
				break;
			case 1:
				timeInSec = '120';
				break;
			case 3:
				timeInSec = '180';
				break;
		}
		this.smartAssist
			.sendSnoozeCommand(timeInSec)
			.then(res => console.log('SNOOZE SUSPEND COMMAND --------------------------------- ', timeInSec, res));
	}

	// Advanced APS Functions

}
