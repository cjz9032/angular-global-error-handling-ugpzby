import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
	showDiffNote: boolean;
	@Output() smartStandbyCapability = new EventEmitter<boolean>();

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
					if (this.smartStandby.isCapable) {
						this.setSmartStandbySection();
					}
					this.smartStandbyCapability.emit(this.smartStandby.isCapable);
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
							this.splitStartEndTime();
							this.smartStandby.daysOfWeekOff = responses[1];
						}).catch((error) => {
							console.log('getSmartStandbyCapability Error', error);
						});
					}
				}).catch((error) => {
					console.log('getSmartStandbyCapability Error', error);
				});
			// this.initSmartStandby();
		}
	}

	initSmartStandby() {
		this.smartStandby.isCapable = true;
		this.smartStandby.isEnabled = true;
		this.smartStandby.activeStartEnd = '9:00-18:00';
		this.smartStandby.daysOfWeekOff = 'tue,wed,thurs,fri,sat,sun';
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
		if (startEndTime.length === 2) {
			this.smartStandbyStartTime = startEndTime[0].trim();
			this.smartStandbyEndTime = startEndTime[1].trim();
		} else {
			this.smartStandbyStartTime = '00:00';
			this.smartStandbyEndTime = '00:00';
		}

		const diff = this.calculateTimeDifference(this.smartStandbyStartTime, this.smartStandbyEndTime);
		if (diff > 20) {
			this.showDiffNote = true;
		} else {
			this.showDiffNote = false;
		}
	}

	onSetActiveStartEnd(event, isStart) {
		let diff, unchangedTime;
		let activeStartEnd;
		if (isStart) {
			activeStartEnd = event + '-' + this.smartStandbyEndTime;
			unchangedTime = this.smartStandbyEndTime;
		} else {
			activeStartEnd = this.smartStandbyStartTime + '-' + event;
			unchangedTime = this.smartStandbyStartTime;
		}
		diff = this.calculateTimeDifference(unchangedTime, event);
		if (diff > 20) {
			this.showDiffNote = true;
		} else {
			this.showDiffNote = false;
		}
		this.smartStandby.activeStartEnd = activeStartEnd;
		this.splitStartEndTime();
		try {
			console.log('setSmartStandbyStartEndTime entered', event);
			if (this.powerService.isShellAvailable) {
				if (!(diff > 20)) {
					this.powerService.setSmartStandbyActiveStartEnd(activeStartEnd)
						.then((value: number) => {
							console.log('setSmartStandbyStartEndTime.then', value);
							if (value === 0) {
								// this.smartStandby.activeStartEnd = activeStartEnd;
								// this.splitStartEndTime();
								console.log('smartStandbyStartEndTime is set successfully');
							}
						})
						.catch(error => {
							console.error('setSmartStandbyStartTime', error);
						});
				}
			}
		} catch (error) {
			console.error(error.message);
		}
		// this.smartStandby.activeStartEnd = activeStartEnd;
		// this.splitStartEndTime();
	}

	onSetDaysOfWeekOff(event) {
		const daysOfWeekOff = event;
		this.smartStandby.daysOfWeekOff = daysOfWeekOff;
		try {
			console.log('setSmartStandbyDaysOfWeekOff entered', event);
			if (this.powerService.isShellAvailable) {
				this.powerService.setSmartStandbyDaysOfWeekOff(daysOfWeekOff)
					.then((value: number) => {
						console.log('setSmartStandbyDaysOfWeekOff.then', value);
						if (value === 0) {
							// this.smartStandby.daysOfWeekOff = daysOfWeekOff;
							console.log('smartStandbyDaysOfWeekOff is set successfully');
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

	calculateTimeDifference(startTime, endTime) {
		let hourMinutes = startTime.split(':');
		const startMinutes = parseInt(hourMinutes[0], 10) * 60 + parseInt(hourMinutes[1], 10);

		hourMinutes = endTime.split(':');
		const endMinutes = parseInt(hourMinutes[0], 10) * 60 + parseInt(hourMinutes[1], 10);
		const diffTime = (Math.abs(endMinutes - startMinutes) / 60);
		return diffTime;
	}
}
