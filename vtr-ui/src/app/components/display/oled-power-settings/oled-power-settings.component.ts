import { Component, OnInit, Input } from '@angular/core';
import { DropDownInterval } from '../../../data-models/common/drop-down-interval.model';

@Component({
	selector: 'vtr-oled-power-settings',
	templateUrl: './oled-power-settings.component.html',
	styleUrls: ['./oled-power-settings.component.scss']
})
export class OledPowerSettingsComponent implements OnInit {
	@Input() description: any;

	title: string;
	public intervals: DropDownInterval[];
	public taskBarDimmerValue: number;
	public backgroundDimmerValue: number;
	public displayDimmerValue: number;

	constructor() { }

	ngOnInit() {
		this.populateIntervals();
		this.initOledSettings();
	}

	private populateIntervals() {
		const seconds = 'seconds';
		const minute = 'minute';
		const minutes = 'minutes';
		const alwaysOn = 'Always on';
		const never = 'Never';
		const halfTime = 'Half time of display off timer';

		this.intervals = [{
			name: alwaysOn,
			value: 0,
			placeholder: '',
			text: alwaysOn
		},
		{
			name: '30',
			value: 1,
			placeholder: seconds,
			text: `30 ${seconds}`
		},
		{
			name: '1',
			value: 2,
			placeholder: minute,
			text: `1 ${minute}`
		},
		{
			name: '2',
			value: 3,
			placeholder: minutes,
			text: `2 ${minutes}`
		},
		{
			name: '3',
			value: 4,
			placeholder: minutes,
			text: `3 ${minutes}`
		},
		{
			name: '5',
			value: 5,
			placeholder: minutes,
			text: `5 ${minutes}`
		},
		{
			name: '10',
			value: 6,
			placeholder: minutes,
			text: `10 ${minutes}`
		},
		{
			name: '15',
			value: 7,
			placeholder: minutes,
			text: `15 ${minutes}`
		},
		{
			name: '20',
			value: 8,
			placeholder: minutes,
			text: `20 ${minutes}`
		},
		{
			name: never,
			value: 9,
			placeholder: '',
			text: never
		},
		{
			name: halfTime,
			value: 10,
			placeholder: '',
			text: halfTime
		}];
	}

	private initOledSettings() {
		// make JS bridge and get current state
		this.taskBarDimmerValue = 0;
		this.backgroundDimmerValue = 0;
		this.displayDimmerValue = 0;
	}

	public onTaskBarDimmerChange($event: DropDownInterval) {
		console.log('onTaskBarDimmerChange', $event);
		if ($event) {
			this.title = $event.placeholder;
		}
	}

	public onBackgroundDimmerChange($event: DropDownInterval) {
		console.log('onBackgroundDimmerChange', $event);
		if ($event) {
			this.title = $event.placeholder;
		}
	}

	public onDisplayDimmerChange($event: DropDownInterval) {
		console.log('onDisplayDimmerChange', $event);
		if ($event) {
			this.title = $event.placeholder;
		}
	}
}
