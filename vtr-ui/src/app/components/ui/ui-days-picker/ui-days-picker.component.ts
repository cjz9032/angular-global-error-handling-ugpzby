import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DaysOfWeek } from 'src/app/enums/days-of-week.enum';
import { AllDays } from 'src/app/data-models/device/all-days.model';

@Component({
	selector: 'vtr-ui-days-picker',
	templateUrl: './ui-days-picker.component.html',
	styleUrls: ['./ui-days-picker.component.scss']
})
export class UiDaysPickerComponent implements OnInit, OnChanges {
	@Input() days: string;
	@Input() subHeadingText: string;
	@Input() daysId: string;
	isSelectedSingleDay: any;
	checkedLength: any;

	allDays: AllDays[] = [
		{ 'dayName': 'Sunday', 'shortName': 'sun', 'displayName': 'Sun', 'status': false },
		{ 'dayName': 'Monday', 'shortName': 'mon', 'displayName': 'Mon', 'status': false },
		{ 'dayName': 'Tuesday', 'shortName': 'tue', 'displayName': 'Tue', 'status': false },
		{ 'dayName': 'Wednesday', 'shortName': 'wed', 'displayName': 'Wed', 'status': false },
		{ 'dayName': 'Thursday', 'shortName': 'thurs', 'displayName': 'Thurs', 'status': false },
		{ 'dayName': 'Friday', 'shortName': 'fri', 'displayName': 'Fri', 'status': false },
		{ 'dayName': 'Saturday', 'shortName': 'sat', 'displayName': 'Sat', 'status': false }
	];
	selectedDays: string[] = [];
	schedule: string;
	copySchedule: string;
	daysOfWeek = DaysOfWeek;
	@Output() setDays = new EventEmitter<string>();
	showDaysDropDown: boolean;

	constructor() { }

	ngOnInit() {
		this.showDaysDropDown = false;
		this.splitDays();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.splitDays();
	}

	splitDays() {
		this.selectedDays = this.days.split(',');
		// this.schedule = this.findSchedule(this.selectedDays);
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
			dayText = 'Everyday';
		} else if (this.checkIsWeekDays() && !this.checkIsWeekends()) {
			dayText = 'Weekdays';
			if (this.getSelectedDays(1).length > 0) {
				dayText += ',' + this.getSelectedDays(1);
			}
		} else if (!this.checkIsWeekDays() && this.checkIsWeekends()) {
			dayText = 'Weekends';
			if (this.getSelectedDays(2).length > 0) {
				dayText += ',' + this.getSelectedDays(2);
			}
		} else {
			dayText = this.getSelectedDays(0);
		}

		if (dayText === '') {
			return 'Weekdays';
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
				dayText = this.allDays[this.daysOfWeek.Sunday].displayName;
			} else if (this.allDays[this.daysOfWeek.Saturday].status) {
				dayText = this.allDays[this.daysOfWeek.Saturday].displayName;
			}

		} else if (reqType === 2) {
			for (let i = 1; i < 6; i++) {
				if (this.allDays[i].status) {
					// for the string display
					if (dayText.length > 0) {
						dayText += ', ';
					}
					dayText += this.allDays[i].displayName;
				}
			}
		} else {
			let cnt = 0;
			for (let i = 0; i < this.allDays.length; i++) {
				if (this.allDays[i].status) {
					if (longDayText === '') {
						longDayText = this.allDays[i].dayName;
					}

					if (dayText.length > 0) {
						dayText += ', ';
					}
					dayText += this.allDays[i].displayName;
					cnt = cnt + 1;
				}
			}
			if (cnt === 1) {
				dayText = longDayText;
			}
		}
		return dayText;
	}

	setOffDays() {
		const setSelectedDays = this.selectedDays.join();
		this.setDays.emit(setSelectedDays);
		this.showDaysDropDown = false;
	}

	checkedDays(event) {
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
		this.showDaysDropDown = false;
	}

	onToggleDropDown() {
		this.showDaysDropDown = !this.showDaysDropDown;
	}
}
