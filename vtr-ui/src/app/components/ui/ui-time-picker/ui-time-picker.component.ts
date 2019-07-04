import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
	selector: 'vtr-ui-time-picker',
	templateUrl: './ui-time-picker.component.html',
	styleUrls: ['./ui-time-picker.component.scss']
})
export class UiTimePickerComponent implements OnInit, OnChanges {

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
	hours = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
	minutes = ['00', '15', '30', '45'];
	amPms = ['AM', 'PM'];

	prevHour: number;
	nextHour: number;
	prevMinute: number;
	nextMinute: number;

	constructor() { }

	ngOnInit() {
		this.showTimerDropDown = false;
		this.splitTime();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.splitTime();
	}

	splitTime() {
		const hourMinutes = this.time.split(':');
		this.hour = parseInt(hourMinutes[0], 10) % 12;
		this.minute = parseInt(hourMinutes[1], 10) / 15;
		this.amPm = Math.floor(parseInt(hourMinutes[0], 10) / 12);
		this.initiateBlock();
	}

	updateMinutes(value: boolean) {
		value ? this.copyMinute = this.nextMinute : this.copyMinute = this.prevMinute;
		this.setTimerBlock();
	}

	updateHours(value: boolean) {
		value ? this.copyHour = this.nextHour : this.copyHour = this.prevHour;
		this.setTimerBlock();
	}

	initiateBlock() {
		this.copyHour = this.hour;
		this.copyMinute = this.minute;
		this.copyAmPm = this.amPm;
		this.setTimerBlock();
	}

	setAmPm(value) {
		this.copyAmPm = value;
	}

	setTimer() {
		const hour = this.copyAmPm ? this.copyHour + 12 : this.copyHour;
		let hourString = hour.toString();
		if (hour < 10) {
			hourString = '0' + hour.toString();
		}
		const time = hourString + ':' + this.minutes[this.copyMinute];
		this.setTime.emit(time);
		this.showTimerDropDown = false;
	}

	clearSettings() {
		this.showTimerDropDown = false;
		this.initiateBlock();
	}
	onToggleDropDown() {
		// this.initiateBlock();
		this.showTimerDropDown = !this.showTimerDropDown;
	}

	setTimerBlock() {
		this.nextHour = this.copyHour + 1;
		this.prevHour = this.copyHour - 1;

		this.nextMinute = this.copyMinute + 1;
		this.prevMinute = this.copyMinute - 1;

		if (this.copyHour === 0) {
			this.prevHour = 11;
		}

		if (this.copyHour === 11) {
			this.nextHour = 0;
		}
		if (this.copyMinute === 0) {
			this.prevMinute = 3;
		}

		if (this.copyMinute === 3) {
			this.nextMinute = 0;
		}
	}
}
