import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-time-picker',
	templateUrl: './ui-time-picker.component.html',
	styleUrls: ['./ui-time-picker.component.scss']
})
export class UiTimePickerComponent implements OnInit {

	@Input() time: string;
	@Input() subHeadingText: string;
	@Input() id: string;

	@Output() setTime = new EventEmitter<string>();

	// @Output() setTime = new EventEmitter<string>();
	hour: number;
	minute: number;
	amPm: number;
	showTimerDropDown: boolean;
	copyHour: number;
	copyMinute: number;
	copyAmPm: number;
	hours = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
	minutes = ['00', '15', '30', '45'];
	amPms = ['AM', 'PM'];

	constructor() { }

	ngOnInit() {
		this.showTimerDropDown = false;
		this.splitTime();
	}
	splitTime() {
		const hourMinutes = this.time.split(':');
		this.hour = parseInt(hourMinutes[0], 10) % 12;
		this.minute = parseInt(hourMinutes[1], 10) / 15;
		this.amPm = Math.floor(parseInt(hourMinutes[0], 10) / 12);
		this.initiateBlock();
	}

	incrementMinutes() {
		if (this.copyMinute < 3) {
			this.copyMinute = this.copyMinute + 1;
		}
	}

	decrementMinutes() {
		if (this.copyMinute > 0) {
			this.copyMinute = this.copyMinute - 1;
		}
	}

	incrementHours() {
		if (this.copyHour < 11) {
			this.copyHour = this.copyHour + 1;
		}
	}

	decrementHours() {
		if (this.copyHour > 0) {
			this.copyHour = this.copyHour - 1;
		}
	}

	initiateBlock() {
		this.copyHour = this.hour;
		this.copyMinute = this.minute;
		this.copyAmPm = this.amPm;
	}

	setAmPm(value: number) {
		this.copyAmPm = value;
	}

	setTimer() {
		const hour = this.copyAmPm ? this.copyHour + 12 : this.copyHour;

		const time = hour + ':' + this.minutes[this.copyMinute];
		this.showTimerDropDown = false;
		this.setTime.emit(time);
	}

	clearSettings() {
		this.showTimerDropDown = false;
		this.initiateBlock();
	}
	onToggleDropDown() {
		this.showTimerDropDown = !this.showTimerDropDown;
	}
}
