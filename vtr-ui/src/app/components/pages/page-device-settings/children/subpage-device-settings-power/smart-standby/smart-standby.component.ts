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
	isSmartStandbyVisible: boolean;
	constructor(public powerService: PowerService) { }

	ngOnInit() {
		this.showSmartStandby();
	}

	public showSmartStandby() {
		this.initSmartStandby();
		if (this.powerService.isShellAvailable) {
			this.powerService.getSmartStandbyCapability()
				.then((response: boolean) => {
					console.log(' getSmartStandbyCapability response', response);
					this.smartStandby.isCapable = response;
					this.isSmartStandbyVisible = response;
					if (this.smartStandby.isCapable) {
						this.setSmartStandbySection();
					}
				}).catch((error) => {
					console.log('getSmartStandbyCapability Error', error);
				});
		}
	}

	setSmartStandbySection() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getSmartStandbyEnabled()
				.then((response: boolean) => {
					console.log('getSmartStandbyEnabled response', response);
					this.smartStandby.isEnabled = response;
					if (this.smartStandby.isEnabled) {
						Promise.all([
							this.powerService.getSmartStandbyActiveStartEnd(),
							this.powerService.getSmartStandbyDaysOfWeekOff()
						]).then((responses: any[]) => {
							this.smartStandby.activeStartEnd = responses[0];
							this.smartStandby.daysOfWeekOff = responses[1];
						}).catch((error) => {
							console.log('getSmartStandbyCapability Error', error);
						});
					}
				}).catch((error) => {
					console.log('getSmartStandbyCapability Error', error);
				});
		}
	}

	initSmartStandby() {
		this.smartStandby.isCapable = true;
		this.smartStandby.isEnabled = true;
		this.smartStandby.activeStartEnd = '9:00-18:00';
		this.smartStandby.daysOfWeekOff = 'sun';
		this.splitStartEndTime();
	}

	public onSmartStandbyToggle(event: any) {
		const isEnabled = event.switchValue;
		try {
			console.log('setSmartStandbyEnabled entered', event);
			if (this.powerService.isShellAvailable) {
				this.powerService.setSmartStandbyEnabled(isEnabled)
					.then((value: number) => {
						console.log('setSmartStandbyEnabled.then', value);
						if (value === 0) {
							this.smartStandby.isEnabled = isEnabled;
						}
						this.setSmartStandbySection();
					})
					.catch(error => {
						console.error('setSmartStandbyEnabled', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
		// this.smartStandby.isEnabled = isEnabled;
	}

	splitStartEndTime() {
		const startEndTime = this.smartStandby.activeStartEnd.split('-');
		this.smartStandbyStartTime = startEndTime[0];
		this.smartStandbyEndTime = startEndTime[1];
	}

	onSetActiveStartEnd(event, isStart) {
		let activeStartEnd;
		if (isStart) {
			activeStartEnd = event + '-' + this.smartStandbyEndTime;
		} else {
			activeStartEnd = this.smartStandbyStartTime + '-' + event;
		}

		try {
			console.log('setSmartStandbyStartTime entered', event);
			if (this.powerService.isShellAvailable) {
				this.powerService.setSmartStandbyActiveStartEnd(activeStartEnd)
					.then((value: number) => {
						console.log('setSmartStandbyStartTime.then', value);
						if (value === 0) {
							this.smartStandby.activeStartEnd = activeStartEnd;
							this.splitStartEndTime();
						}
					})
					.catch(error => {
						console.error('setSmartStandbyStartTime', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
		// this.smartStandby.activeStartEnd = activeStartEnd;
	}

	onSetDaysOfWeekOff(event) {
		const daysOfWeekOff = event;
		try {
			console.log('setSmartStandbyDaysOfWeekOff entered', event);
			if (this.powerService.isShellAvailable) {
				this.powerService.setSmartStandbyDaysOfWeekOff(daysOfWeekOff)
					.then((value: number) => {
						console.log('setSmartStandbyDaysOfWeekOff.then', value);
						if (value === 0) {
							this.smartStandby.daysOfWeekOff = daysOfWeekOff;
						}
					})
					.catch(error => {
						console.error('setSmartStandbyDaysOfWeekOff.error', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
		// this.smartStandby.daysOfWeekOff = daysOfWeekOff;
	}
}
