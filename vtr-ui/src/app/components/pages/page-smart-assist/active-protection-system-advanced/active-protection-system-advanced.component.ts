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
	selector: 'vtr-active-protection-system-advanced',
	templateUrl: './active-protection-system-advanced.component.html',
	styleUrls: ['./active-protection-system-advanced.component.scss']
})
export class ActiveProtectionSystemAdvancedComponent implements OnInit {
	@Input() penCapability: boolean;
	@Input() touchCapability: boolean;
	@Input() pSensorCapability: boolean;

	penStatus: boolean;
	touchStatus: boolean;
	pSensorStatus: boolean;
	penDelay: string;

	public intervals: DropDownInterval[];

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
	constructor(private smartAssist: SmartAssistService) {}

	ngOnInit() {
		this.populateIntervals();
		console.log(this.penCapability, this.touchCapability, this.pSensorCapability);
		this.initAPSAdvanced();
	}
	initAPSAdvanced() {
		this.smartAssist
			.getPenSetting()
			.then(res => { this.penStatus = res; console.log("*******",res); })
			.catch(error =>  console.log(error));
		this.smartAssist
			.getTouchInputSetting()
			.then(res => { this.touchStatus = res; console.log("*******",res); })
			.catch(error =>  console.log(error));
		this.smartAssist
			.getPSensorSetting()
			.then(res => { this.pSensorStatus = res; console.log("*******",res); })
			.catch(error =>  console.log(error));
		this.smartAssist
			.getPenDelayTime()
			.then(res => { this.penDelay = res.toString(); console.log("*******",res); })
			.catch(error =>  console.log(error));
	}



}
