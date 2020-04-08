import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../common/common.service';
import { AllDays } from 'src/app/data-models/device/all-days.model';
import { DaysOfWeek } from 'src/app/enums/days-of-week.enum';

@Injectable({
	providedIn: 'root'
})
export class SmartStandbyService {
	allDays: AllDays[] = [
		{ shortName: 'sun', status: false },
		{ shortName: 'mon', status: false },
		{ shortName: 'tue', status: false },
		{ shortName: 'wed', status: false },
		{ shortName: 'thurs', status: false },
		{ shortName: 'fri', status: false },
		{ shortName: 'sat', status: false }
	];
	daysOfWeek = DaysOfWeek;
	days: string;
	checkedLength = 0;
	selectedDays: string[] = [];
	schedule: string;
	scheduleLongForm: string;

	constructor(
		public translate: TranslateService,
		public commonService: CommonService) { }

	setSelectedDayText(isLongForm: boolean = false): string {
		let dayText = '';
		if (this.checkIsWeekends() && this.checkIsWeekDays()) {
			dayText = this.translate.instant('device.deviceSettings.power.smartStandby.days.everyday');
		} else if (this.checkIsWeekDays() && !this.checkIsWeekends()) {
			dayText = this.translate.instant('device.deviceSettings.power.smartStandby.days.weekdays');
			if (this.getSelectedDays(1, isLongForm).length > 0) {
				dayText += ', ' + this.getSelectedDays(1, isLongForm);
			}
		} else if (!this.checkIsWeekDays() && this.checkIsWeekends()) {
			if (this.getSelectedDays(2, isLongForm).length > 0) {
				dayText = this.getSelectedDays(2, isLongForm);
			}
			dayText += this.getSelectedDays(2, isLongForm).length !== 0 ? ', ' + this.translate.instant('device.deviceSettings.power.smartStandby.days.weekends'):
			this.translate.instant('device.deviceSettings.power.smartStandby.days.weekends');
		} else {
			dayText = this.getSelectedDays(0, isLongForm);
		}

		if (dayText === '') {
			return this.translate.instant('device.deviceSettings.power.smartStandby.days.weekdays');
		} else {
			return dayText;
		}
	}

	checkIsWeekends(): boolean {
		if (this.allDays[this.daysOfWeek.Sunday].status &&
			this.allDays[this.daysOfWeek.Saturday].status) {
			return true;
		}
		return false;
	}

	checkIsWeekDays(): boolean {
		for (let i = 1; i < 6; i++) {
			if (!this.allDays[i].status) {
				return false;
			}
		}
		return true;
	}

	getSelectedDays(reqType, isLongForm: boolean = false): string {
		let dayText = '';
		let longDayText = '';
		if (reqType === 1) {  // weekends check
			if (this.allDays[this.daysOfWeek.Sunday].status) {
				if (!isLongForm) {
					dayText = this.translate.instant(
						'device.deviceSettings.power.smartStandby.days.shortName.'
						+ this.allDays[this.daysOfWeek.Sunday].shortName);
				} else {
					dayText = this.translate.instant(
						'device.deviceSettings.power.smartStandby.days.name.'
						+ this.allDays[this.daysOfWeek.Sunday].shortName);
				}
			} else if (this.allDays[this.daysOfWeek.Saturday].status) {
				if (!isLongForm) {
					dayText = this.translate.instant(
						'device.deviceSettings.power.smartStandby.days.shortName.'
						+ this.allDays[this.daysOfWeek.Saturday].shortName);
				} else {
					dayText = this.translate.instant(
						'device.deviceSettings.power.smartStandby.days.name.'
						+ this.allDays[this.daysOfWeek.Saturday].shortName);
				}
			}

		} else if (reqType === 2) {
			for (let i = 1; i < 6; i++) {
				if (this.allDays[i].status) {
					// for the string display
					if (dayText.length > 0) {
						dayText += ', ';
					}

					if (!isLongForm) {
						dayText += this.translate.instant(
							'device.deviceSettings.power.smartStandby.days.shortName.'
							+ this.allDays[i].shortName);
					} else {
						dayText += this.translate.instant(
							'device.deviceSettings.power.smartStandby.days.name.'
							+ this.allDays[i].shortName);
					}
				}
			}
		} else {
			let cnt = 0;
			this.allDays.forEach((day) => {
				if (day.status) {
					if (longDayText === '') {

						longDayText = this.translate.instant(
							'device.deviceSettings.power.smartStandby.days.name.'
							+ day.shortName);

					}

					if (dayText.length > 0) {
						dayText += ', ';
					}
					if (!isLongForm) {
						dayText += this.translate.instant(
							'device.deviceSettings.power.smartStandby.days.shortName.'
							+ day.shortName);
					} else {
						dayText += this.translate.instant(
							'device.deviceSettings.power.smartStandby.days.name.'
							+ day.shortName);
					}
					cnt = cnt + 1;
				}
			});
			if (cnt === 1) {
				dayText = longDayText;
			}
		}
		return dayText;
	}

	splitDays() {
		this.selectedDays = this.days.split(',');
		this.checkedLength = this.selectedDays.length;
		this.setDaysOfWeekOff();
		this.schedule = this.setSelectedDayText();
		this.scheduleLongForm = this.setSelectedDayText(true);
	}

	setDaysOfWeekOff() {
		this.allDays.forEach(day => {
			if (this.selectedDays.includes(day.shortName)) {
				day.status = true;
			} else {
				day.status = false;
			}
		});
	}
}
