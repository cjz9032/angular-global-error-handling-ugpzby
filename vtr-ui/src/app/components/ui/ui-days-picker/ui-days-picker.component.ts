import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DaysOfWeek, DaysOfWeekShort } from 'src/app/enums/days-of-week.enum';

@Component({
	selector: 'vtr-ui-days-picker',
	templateUrl: './ui-days-picker.component.html',
	styleUrls: ['./ui-days-picker.component.scss']
})
export class UiDaysPickerComponent implements OnInit {
	@Input() days: string;
	@Input() subHeadingText: string;
	@Input() daysId: string;

	schedule: string;
	@Output() setDays = new EventEmitter<string>();
	showDaysDropDown: boolean;

	constructor() { }

	ngOnInit() {
		this.splitDays();
	}


	splitDays() {
		const days = this.days.split(',');
		const length = days.length;
		if (length === 1) {
			this.schedule = DaysOfWeek[DaysOfWeekShort[days[0]]];
		} else if (length === 7) {
			this.schedule = 'Everyday';
		} else {
			if (days.includes(DaysOfWeekShort[DaysOfWeekShort.sun]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.sat])) {
				this.schedule = 'Weekends';
			}
			if (days.includes(DaysOfWeekShort[DaysOfWeekShort.mon]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.tue]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.wed]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.thurs]) &&
				days.includes(DaysOfWeekShort[DaysOfWeekShort.fri])) {
					this.schedule = 'Weekdays';

			}
		}
	}

	initiateBlock() {

	}

	setOffDays() {

	}

	clearSettings() {
		this.showDaysDropDown = false;
		this.initiateBlock();
	}
	onToggleDropDown() {
		this.showDaysDropDown = !this.showDaysDropDown;
	}
}
