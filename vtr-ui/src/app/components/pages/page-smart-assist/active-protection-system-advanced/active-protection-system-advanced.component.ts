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
import { TranslateService } from '@ngx-translate/core';
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
	penDelay: number;

	public intervals: DropDownInterval[];

	private populateIntervals() {

		const seconds = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.seconds'); //'seconds';


		this.intervals = [{
			name: '0',
			value: 0,
			placeholder: seconds,
			text: `0 ${seconds}`
		},
		{
			name: '5',
			value: 5,
			placeholder: seconds,
			text: `5 ${seconds}`
		},
		{
			name: '10',
			value: 10,
			placeholder: seconds,
			text: `10 ${seconds}`
		},
		{
			name: '15',
			value: 15,
			placeholder: seconds,
			text: `15 ${seconds}`
		},
		];
	}
	constructor(private smartAssist: SmartAssistService, private translate: TranslateService) { }

	ngOnInit() {
		this.populateIntervals();
		console.log(this.penCapability, this.touchCapability, this.pSensorCapability);
		this.initAPSAdvanced();
	}
	initAPSAdvanced() {
		this.smartAssist
			.getPenSetting()
			.then(res => {
				this.penStatus = res;
				console.log('Pen Status --------------------------------- ', res);
				this.smartAssist
					.getPenDelayTime()
					.then(res => {
						this.penDelay = res;
						console.log('PEN DELAY --------------------------------- ', res, typeof res);
					})
					.catch(error => console.log(error));
			})
			.catch(error => console.log(error));
		this.smartAssist
			.getTouchInputSetting()
			.then(res => {
				this.touchStatus = res;
				console.log('Touch Status --------------------------------- ', res);
			})
			.catch(error => console.log(error));
		this.smartAssist
			.getPSensorSetting()
			.then(res => {
				this.pSensorStatus = res;
				console.log('PSensor --------------------------------- ', res);
			})
			.catch(error => console.log(error));
	}
	setPenSetting(event) {
		const value = !this.penStatus;
		this.penStatus = !this.penStatus;
		this.smartAssist
			.setPenSetting(value)
			.then(res => {
				console.log('PEN STATUS SET --------------------------------- ', res);
				this.smartAssist
					.getPenDelayTime()
					.then(response => {
						this.penDelay = response;
						console.log('PEN DELAY --------------------------------- ', res, typeof res);
					})
					.catch(error => console.log(error));
			})
			.catch(err => console.log(err));
	}
	setPenDelayTime(event) {
		const value = event.value;
		this.smartAssist
			.setPenDelayTime(value)
			.then(res => {
				console.log('PEN DELAY TIME --------------------------------- ', value, res)
				this.smartAssist
					.getPenDelayTime()
					.then(response => {
						this.penDelay = response;
						console.log('PEN DELAY --------------------------------- ', res, typeof res);
					})
					.catch(error => console.log(error));
			})
			.catch(err => console.log(err));
	}
	setTouchInputSetting(event) {
		const value = !this.touchStatus;
		this.smartAssist
			.setTouchInputSetting(value)
			.then(res => {
				console.log('TOUCH INPUT SET --------------------------------- ', res);
				this.smartAssist
					.getTouchInputSetting()
					.then(response => {
						this.touchStatus = response;
						console.log('Touch Status --------------------------------- ', res);
					})
					.catch(error => console.log(error));
			})
			.catch(err => console.log(err));
	}
	setPSensorSetting(event) {
		const value = !this.pSensorStatus;
		this.smartAssist
			.setPSensorSetting(value)
			.then(res => {
				console.log('PSENSOR SET --------------------------------- ', res);
				this.smartAssist
					.getPSensorSetting()
					.then(response => {
						this.pSensorStatus = response;
						console.log('PSensor --------------------------------- ', res);
					})
					.catch(error => console.log(error));
			})
			.catch(err => console.log(err));
	}


}
