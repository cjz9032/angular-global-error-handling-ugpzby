import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import range from 'lodash/range';

export interface DateType {
	year: number;
	month: number;
	day: number;
}
export interface TimeType {
	hours: number;
	minutes: number;
	amPm: string;
}
export interface MonthType {
	id: number;
	i18n: string;
}

@Component({
	selector: 'vtr-date-time-picker',
	templateUrl: './date-time-picker.component.html',
	styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent implements OnInit {
	@Input() type = 'date';
	@Input() id: string;
	@Input() date: DateType;
	@Input() time: TimeType;

	@Output() dateChange = new EventEmitter<DateType>();
	@Output() timeChange = new EventEmitter<TimeType>();

	private startYear = '1970';
	private endYear = '2070';
	today = new Date();
	days: Array<number>;
	years: Array<number>;

	hours: Array<number>;
	minutes: Array<number>;

	selectedMonth: string;
	selectedYear: number;
	selectedDay: number;

	selectHours: number;
	selectMinutes: number;
	selectAmPm: string;

	currentHour: number;
	currentMinutes: number;
	currentAmPm: string;

	months = [
		{
			id: 1,
			i18n: 'common.dateTime.jan',
		},
		{
			id: 2,
			i18n: 'common.dateTime.feb',
		},
		{
			id: 3,
			i18n: 'common.dateTime.mar',
		},
		{
			id: 4,
			i18n: 'common.dateTime.apr',
		},
		{
			id: 5,
			i18n: 'common.dateTime.may',
		},
		{
			id: 6,
			i18n: 'common.dateTime.jun',
		},
		{
			id: 7,
			i18n: 'common.dateTime.jul',
		},
		{
			id: 8,
			i18n: 'common.dateTime.aug',
		},
		{
			id: 9,
			i18n: 'common.dateTime.sep',
		},
		{
			id: 10,
			i18n: 'common.dateTime.oct',
		},
		{
			id: 11,
			i18n: 'common.dateTime.nov',
		},
		{
			id: 12,
			i18n: 'common.dateTime.dec',
		},
	];
	amPm = ['common.dateTime.am', 'common.dateTime.pm'];
	monthsString = [];

	isOpen = false;
	translate: TranslateService;

	constructor(translate: TranslateService) {
		this.translate = translate;
	}

	ngOnInit() {
		this.translate
			.stream([
				'common.dateTime.am',
				'common.dateTime.pm',
				'common.dateTime.jan',
				'common.dateTime.feb',
				'common.dateTime.mar',
				'common.dateTime.apr',
				'common.dateTime.may',
				'common.dateTime.jun',
				'common.dateTime.jul',
				'common.dateTime.aug',
				'common.dateTime.sep',
				'common.dateTime.oct',
				'common.dateTime.nov',
				'common.dateTime.dec',
			])
			.subscribe((res: any) => {
				for (const key in this.months) {
					if (Object.prototype.hasOwnProperty.call(this.months, key)) {
						const element = this.months[key];
						element.i18n = res[element.i18n];
						this.monthsString.push(element.i18n);
					}
				}
				this.amPm[0] = res[this.amPm[0]];
				this.amPm[1] = res[this.amPm[1]];
				if (this.type === 'date') {
					this.initializeDateControl();
				} else if (this.type === 'time') {
					this.initializeTimeControl();
				}
			});
	}

	onMonthChange($event) {
		this.selectedMonth = $event.value;
		this.updateDays(this.getMonthId(this.selectedMonth), this.selectedYear);
		this.dateChange.emit({
			year: this.selectedYear,
			month: this.getMonthId(this.selectedMonth),
			day: this.selectedDay,
		});
	}

	onYearChange($event) {
		this.selectedYear = $event.value;
		this.updateDays(this.getMonthId(this.selectedMonth), this.selectedYear);
		this.dateChange.emit({
			year: this.selectedYear,
			month: this.getMonthId(this.selectedMonth),
			day: this.selectedDay,
		});
	}

	onDayChange($event) {
		this.selectedDay = $event.value;
		this.dateChange.emit({
			year: this.selectedYear,
			month: this.getMonthId(this.selectedMonth),
			day: this.selectedDay,
		});
	}

	onHoursChange($event) {
		this.selectHours = $event.value;
		this.timeChange.emit({
			hours: this.selectHours,
			minutes: this.selectMinutes,
			amPm: this.selectAmPm === 'am' ? 'am' : 'pm',
		});
	}

	onMinutesChange($event) {
		this.selectMinutes = $event.value;
		this.timeChange.emit({
			hours: this.selectHours,
			minutes: this.selectMinutes,
			amPm: this.selectAmPm === 'am' ? 'am' : 'pm',
		});
	}

	onAmPmChange($event) {
		this.selectAmPm = $event.value;
		this.timeChange.emit({
			hours: this.selectHours,
			minutes: this.selectMinutes,
			amPm: this.selectAmPm === 'am' ? 'am' : 'pm',
		});
	}

	private initializeDateControl() {
		this.selectedYear = this.date?.year ? this.date.year : this.today.getFullYear();
		this.selectedMonth = this.date?.month
			? this.date.month
			: this.monthsString[this.today.getMonth()];
		this.selectedDay = this.date?.day ? this.date.day : this.today.getDate();

		const yearRange = this.initializeYears(this.startYear, this.endYear);
		this.years = range(yearRange[0], yearRange[1] + 1);
		this.days = range(
			1,
			this.calcDayCount(this.today.getMonth() + 1, this.today.getFullYear()) + 1
		);
	}

	private initializeTimeControl() {
		this.hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		this.minutes = range(0, 60);

		let currentHour24 = this.today.getHours();
		this.currentAmPm =
			typeof this.time?.amPm === 'boolean'
				? this.time.amPm
				: currentHour24 >= 12
				? 'am'
				: 'pm';
		currentHour24 = currentHour24 % 12;
		this.currentHour = this.time?.hours ? this.time.hours : currentHour24 ? currentHour24 : 12;
		this.currentMinutes = this.time?.minutes ? this.time.minutes : this.today.getMinutes();
	}

	private updateDays(month: number, year: number) {
		const newDayCount = this.calcDayCount(month, year);
		if (!(newDayCount > 0) || newDayCount === this.days.length) {
			return;
		}

		if (this.days.length > newDayCount) {
			if (this.selectedDay > newDayCount) {
				this.selectedDay = newDayCount;
			}
			this.days.splice(newDayCount, this.days.length - newDayCount);
		} else {
			this.days.push(...range(this.days.length + 1, newDayCount + 1));
		}
	}

	private calcDayCount(month: number, year: number): number | undefined {
		return !range(1, 13).includes(month)
			? undefined
			: [1, 3, 5, 7, 8, 10, 12].includes(month)
			? 31
			: month === 2
			? (year % 100 ? year % 4 : year % 400)
				? 28
				: 29
			: 30;
	}

	private initializeYears(start: string, end: string): [number, number] {
		const startYear = parseInt(start, 10);
		const endYear = parseInt(end, 10);

		if (startYear > 0 && endYear > 0) {
			return startYear < endYear ? [startYear, endYear] : [startYear, startYear + 100];
		} else if (startYear > 0 && !(endYear > 0)) {
			return [startYear, startYear + 100];
		} else if (!(startYear > 0) && endYear > 0) {
			return endYear - 100 > 0 ? [endYear - 100, endYear] : [0, endYear];
		} else {
			return [1970, 2070];
		}
	}

	private getMonthId(value): number {
		let res: number;
		this.monthsString.forEach((element, index) => {
			if (value === element) {
				res = index;
			}
		});
		return res;
	}
}
