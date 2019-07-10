import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DaysOfWeek, DaysOfWeekShort } from 'src/app/enums/days-of-week.enum';

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
	allDays: any = [
		{ 'dayname': 'Sunday', 'shortname': 'sun', 'displayname': 'Sun', 'status': false },
		{ 'dayname': 'Monday', 'shortname': 'mon', 'displayname': 'Mon', 'status': false },
		{ 'dayname': 'Tuesday', 'shortname': 'tue', 'displayname': 'Tue', 'status': false },
		{ 'dayname': 'Wednesday', 'shortname': 'wed', 'displayname': 'Wed', 'status': false },
		{ 'dayname': 'Thursday', 'shortname': 'thurs', 'displayname': 'Thurs', 'status': false },
		{ 'dayname': 'Friday', 'shortname': 'fri', 'displayname': 'Fri', 'status': false },
		{ 'dayname': 'Saturday', 'shortname': 'sat', 'displayname': 'Sat', 'status': false }
	];
	selectedDays: any = [];
	// , , Tuesday, Wednesday, Thursday, Friday, Saturday
	schedule: string;
	copySchedule: string;
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
		this.checkedLength = this.selectedDays.length;
		this.schedule = this.findSchedule(this.selectedDays);
	}

	findSchedule(days) {
		let schedule;
		const length = days.length;
		// "mon" | "Monday" (long date will be displayed if only 1 day is selected)
		if (length === 1) {
			schedule = DaysOfWeek[DaysOfWeekShort[days[0]]];
			this.isSelectedSingleDay = DaysOfWeek[DaysOfWeekShort[days[0]]];
			for (let i = 0; i < this.allDays.length; i++) {
				if (this.allDays[i].shortname === days[0]) {
					this.allDays[i].status = true;
				}
			}
		} else if (length === 7) {
			schedule = 'Everyday';
			for (let i = 0; i < this.allDays.length; i++) {
				this.allDays[i].status = true;
			}

		} else {
			// "sun,sat" | "Weekends"
			if (days.includes(DaysOfWeekShort[DaysOfWeekShort.sun]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.sat])) {
				schedule = 'Weekends';
				this.allDays[0].status = true;
				this.allDays[6].status = true;
			}

			// "mon,tue,wed,thurs,fri" | "Weekdays"
			if (days.includes(DaysOfWeekShort[DaysOfWeekShort.mon]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.tue]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.wed]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.thurs]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.fri])) {
				schedule = 'Weekdays';
				for (let i = 1; i < 6; i++) {
					this.allDays[i].status = true;
				}
			}
			// "mon,tue,wed,thurs,fri,sat" | "Weekdays, Sat"
			if (days.includes(DaysOfWeekShort[DaysOfWeekShort.mon]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.tue]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.wed]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.thurs]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.fri]) &&
				(days.includes(DaysOfWeekShort[DaysOfWeekShort.sat]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.sun]))) {
				if (days.includes(DaysOfWeekShort[DaysOfWeekShort.sun])) {
					schedule = 'Weekdays, Sun';
					this.allDays[0].status = true;
				}
				if (days.includes(DaysOfWeekShort[DaysOfWeekShort.sat])) {
					schedule = 'Weekdays, Sat';
					this.allDays[6].status = true;
				}
				for (let i = 1; i < 6; i++) {
					this.allDays[i].status = true;
				}
			}
			// "sun,mon,sat" | "Weekends, Mon"
			if (days.includes(DaysOfWeekShort[DaysOfWeekShort.sun]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.sat]) &&
				(days.includes(DaysOfWeekShort[DaysOfWeekShort.mon]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.tue]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.wed]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.thurs]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.fri]))) {

				this.allDays[0].status = true;
				this.allDays[6].status = true;

				if (days.includes(DaysOfWeekShort[DaysOfWeekShort.mon]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.tue])) {
					if (days.includes(DaysOfWeekShort[DaysOfWeekShort.mon])) {
						schedule = 'Weekends, Mon';
						this.allDays[1].status = true;
					} else if (days.includes(DaysOfWeekShort[DaysOfWeekShort.tue])) {
						schedule = 'Weekends, Tue';
						this.allDays[2].status = true;
					}
				} else if (days.includes(DaysOfWeekShort[DaysOfWeekShort.wed]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.thurs])) {
					if (days.includes(DaysOfWeekShort[DaysOfWeekShort.wed])) {
						schedule = 'Weekends, Wed';
						this.allDays[3].status = true;
					} else if (days.includes(DaysOfWeekShort[DaysOfWeekShort.thurs])) {
						schedule = 'Weekends, Thurs';
						this.allDays[4].status = true;
					}
				} else if (days.includes(DaysOfWeekShort[DaysOfWeekShort.fri])) {
					schedule = 'Weekends, Fri';
					this.allDays[5].status = true;
				}
			}

			// "sun,mon,tue,fri,sat" | "Weekends, Mon, Tue, Fri"
			if (days.includes(DaysOfWeekShort[DaysOfWeekShort.sun]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.sat]) &&
				(days.includes(DaysOfWeekShort[DaysOfWeekShort.mon]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.tue]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.wed]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.thurs]) ||
					days.includes(DaysOfWeekShort[DaysOfWeekShort.fri])
				)
			) {
				console.log('sun,mon,tue,fri,sat | Weekends, Mon, Tue, Fri');
				let schedule1 = 'Weekends';
				let length2 = 0;
				for (let i = 1; i < 6; i++) {
					if (days.includes(this.allDays[i].shortname)) {
						length2++;
						schedule1 = schedule1 + ', ' + this.allDays[i].displayname;
						console.log(schedule1);
					}
				}
				if (length2 < 5 && length2 > 1) {
					schedule = schedule1;
					console.log(schedule);
				}
			}
			if (!(days.includes(DaysOfWeekShort[DaysOfWeekShort.mon]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.tue]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.wed]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.thurs]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.fri])
			) &&
				!(days.includes(DaysOfWeekShort[DaysOfWeekShort.sun]) &&
					days.includes(DaysOfWeekShort[DaysOfWeekShort.sat]))) {
				let schedule2 = '';

				for (let i = 0; i < 6; i++) {
					if (days.includes(this.allDays[i].shortname)) {

						schedule2 = schedule2 + ', ' + this.allDays[i].displayname;
						console.log(schedule2);
					}
				}
				schedule2 = schedule2.substr(1);
				schedule = schedule2;
			}
		}
		return schedule;
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
		this.copySchedule = this.findSchedule(this.selectedDays);
		this.checkedLength = this.selectedDays.length;
	}

	clearSettings() {
		this.showDaysDropDown = false;
	}

	onToggleDropDown() {
		this.showDaysDropDown = !this.showDaysDropDown;
	}
}
