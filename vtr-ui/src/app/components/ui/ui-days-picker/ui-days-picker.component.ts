import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DaysOfWeek } from 'src/app/enums/days-of-week.enum';
import { AllDays } from 'src/app/data-models/device/all-days.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-ui-days-picker',
	templateUrl: './ui-days-picker.component.html',
	styleUrls: ['./ui-days-picker.component.scss']
})
export class UiDaysPickerComponent implements OnInit, OnChanges {
	@Input() days: string;
	@Input() subHeadingText: string;
	@Input() daysId: string;
	@Input() showDropDown: boolean;
	isSelectedSingleDay: any;
	checkedLength: any;

	allDays: AllDays[] = [
		{ shortName: 'sun', status: false },
		{ shortName: 'mon', status: false },
		{ shortName: 'tue', status: false },
		{ shortName: 'wed', status: false },
		{ shortName: 'thurs', status: false },
		{ shortName: 'fri', status: false },
		{ shortName: 'sat', status: false }
	];
	selectedDays: string[] = [];
	schedule: string;
	daysOfWeek = DaysOfWeek;
	@Output() setDays = new EventEmitter<string>();

	constructor(public translate: TranslateService, public commonService: CommonService) { }

	ngOnInit() {
		this.splitDays();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.splitDays();
	}

	splitDays() {
		this.selectedDays = this.days.split(',');
		this.checkedLength = this.selectedDays.length;
		this.setDaysOfWeekOff();
		this.schedule = this.setSelectedDayText();
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

	setSelectedDayText(): string {
		let dayText = '';
		if (this.checkIsWeekends() && this.checkIsWeekDays()) {
			dayText = this.translate.instant('device.deviceSettings.power.smartStandby.days.everyday');
		} else if (this.checkIsWeekDays() && !this.checkIsWeekends()) {
			dayText = this.translate.instant('device.deviceSettings.power.smartStandby.days.weekdays');
			if (this.getSelectedDays(1).length > 0) {
				dayText += ',' + this.getSelectedDays(1);
			}
		} else if (!this.checkIsWeekDays() && this.checkIsWeekends()) {
			dayText = this.translate.instant('device.deviceSettings.power.smartStandby.days.weekends');
			if (this.getSelectedDays(2).length > 0) {
				dayText += ',' + this.getSelectedDays(2);
			}
		} else {
			dayText = this.getSelectedDays(0);
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

	getSelectedDays(reqType): string {
		let dayText = '';
		let longDayText = '';
		if (reqType === 1) {  // weekends check
			if (this.allDays[this.daysOfWeek.Sunday].status) {

				dayText = this.translate.instant(
					'device.deviceSettings.power.smartStandby.days.shortName.'
					+ this.allDays[this.daysOfWeek.Sunday].shortName);

			} else if (this.allDays[this.daysOfWeek.Saturday].status) {

				dayText = this.translate.instant(
					'device.deviceSettings.power.smartStandby.days.shortName.'
					+ this.allDays[this.daysOfWeek.Saturday].shortName);

			}

		} else if (reqType === 2) {
			for (let i = 1; i < 6; i++) {
				if (this.allDays[i].status) {
					// for the string display
					if (dayText.length > 0) {
						dayText += ', ';
					}

					dayText += this.translate.instant(
						'device.deviceSettings.power.smartStandby.days.shortName.'
						+ this.allDays[i].shortName);

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
					dayText += this.translate.instant(
						'device.deviceSettings.power.smartStandby.days.shortName.'
						+ day.shortName);
					cnt = cnt + 1;
				}
			});
			if (cnt === 1) {
				dayText = longDayText;
			}
		}
		return dayText;
	}

	setOffDays() {
		const setSelectedDays = this.selectedDays.join();
		this.setDays.emit(setSelectedDays);
		this.sendToggleNotification(false);
	}

	selectDay(event) {
		console.log(event);
		console.log(event.target.checked);
		console.log(event.target.value);
		if (event.target.checked) {
			this.selectedDays.push(event.target.value);
		} else {
			const index = this.selectedDays.indexOf(event.target.value);
			this.selectedDays.splice(index, 1);
		}
		this.checkedLength = this.selectedDays.length;
	}

	clearSettings() {
		this.splitDays();
		this.sendToggleNotification(false);
	}

	onToggleDropDown() {
		this.splitDays();
		this.sendToggleNotification(!this.showDropDown);
	}

	sendToggleNotification(dropDown: boolean) {
		this.commonService.sendNotification('smartStandbyToggles', { id: 2, value: dropDown });
	}
}
