import {
	Component,
	OnInit,
	Input
} from '@angular/core';

import {
	DropDownInterval
} from '../../../../data-models/common/drop-down-interval.model';

import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';


@Component({
	selector: 'vtr-active-protection-system',
	templateUrl: './active-protection-system.component.html',
	styleUrls: ['./active-protection-system.component.scss']
})
export class ActiveProtectionSystemComponent implements OnInit {
	advanced: boolean; // for advanced section
	apsStatus: boolean;
	apsSensitivity: number;
	repeatShock = true;
	public intervals: DropDownInterval[];
	// public taskBarDimmerValue: number;

	private populateIntervals() {
		const seconds = 'seconds';
		const minute = 'minute';
		const minutes = 'minutes';

		this.intervals = [{
				name: '30',
				value: 1,
				placeholder: seconds,
				text: `30 ${seconds}`
			},
			{
				name: '1',
				value: 2,
				placeholder: minute,
				text: `1 ${minute}`
			},
			{
				name: '2',
				value: 3,
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
		this.advanced = !this.advanced;
	}
	constructor(private smartAssist: SmartAssistService) {}

	ngOnInit() {
		this.advanced = false;
		this.populateIntervals();
		this.initAPS(); // get Default or set APS values
	}

	initAPS() {
		this.smartAssist
			.getAPSMode()
			.then(res => res ? this.apsStatus = true : this.apsStatus = false);
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
			});
	}

	setAPSSensitivityLevel(event) {
		let value;
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
			.then(res => console.log('APS SET', res));
	}

	setRepetitiveShock(event) {
		console.log(event);
	}
}
