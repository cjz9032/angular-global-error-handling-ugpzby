import { Component, OnInit } from '@angular/core';
import { PowerService } from 'src/app/services/power/power.service';
import { SmartStandby } from 'src/app/data-models/device/smart-standby.model';

@Component({
	selector: 'vtr-smart-standby',
	templateUrl: './smart-standby.component.html',
	styleUrls: ['./smart-standby.component.scss']
})
export class SmartStandbyComponent implements OnInit {

	public smartStandby = new SmartStandby();
	public smartStandbyStartTime: string;
	public smartStandbyEndTime: string;
	constructor(public powerService: PowerService) { }

	ngOnInit() {
		this.setSmartStandbySection();
	}

	public setSmartStandbySection() {
		this.initSmartStandby();
		// if (this.powerService.isShellAvailable) {
		// 	this.powerService.getSmartStandbyCapability()
		// 		.then((response: boolean) => {
		// 			this.smartStandby.isCapable = response;
		// 			if (this.smartStandby.isCapable) {
		// 				Promise.all([
		// 					this.powerService.getSmartStandbyEnabled(),
		// 					this.powerService.getSmartStandbyActiveStartEnd(),
		// 					this.powerService.getSmartStandbyDaysOfWeekOff()
		// 				]).then((responses: any[]) => {
		// 					this.smartStandby.isEnabled = responses[0];
		// 					this.smartStandby.activeStartEnd = responses[1];
		// 					this.smartStandby.daysOfWeekOff = responses[2];
		// 				});
		// 			}
		// 		}).catch((error) => {
		// 			console.log('In setSmartStandbySection Error', error);
		// 		});
		// }
	}

	initSmartStandby() {
		this.smartStandby.isCapable = true;
		this.smartStandby.isEnabled = true;
		this.smartStandby.activeStartEnd = '9:00-18:00';
		this.smartStandby.daysOfWeekOff = '';
		this.splitStartEndTime();
	}

	public onSmartStandbyToggle(event: any) {
		this.smartStandby.isEnabled = event.switchValue;
		this.powerService.setSmartStandbyEnabled(event);

		try {
			console.log('setSmartStandbyEnabled entered', event);
			if (this.powerService.isShellAvailable) {
				this.powerService.setSmartStandbyEnabled(event.switchValue)
					.then((value: boolean) => {
						console.log('setSmartStandbyEnabled.then', value);
						// this.setSmartStandbySection();
					})
					.catch(error => {
						console.error('setSmartStandbyEnabled', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	splitStartEndTime() {
		const startEndTime = this.smartStandby.activeStartEnd.split('-');
		this.smartStandbyStartTime = startEndTime[0];
		this.smartStandbyEndTime = startEndTime[1];
	}
}
