import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-clock',
	templateUrl: './clock.component.html',
	styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit {
	hour = 0;
	minute: any;
	ampm = 'am';
	weekday = '';
	month = '';
	date = 0;
	year = 0;

	months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	constructor() {}

	ngOnInit() {
		const now = new Date();
		this.hour = now.getHours();
		if (this.hour === 0) {
			this.hour = 12;
			this.ampm = 'am';
		}
		if (this.hour > 12) {
			this.hour = this.hour - 12;
			this.ampm = 'pm';
		}
		this.minute = now.getMinutes();
		if (this.minute < 10) {
			this.minute = '0' + this.minute;
		}
		this.weekday = this.days[now.getDay()];
		this.month = this.months[now.getMonth()];
		this.date = now.getDate();
		this.year = now.getFullYear();
	}
}
