import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-widget-system-monitor',
	templateUrl: './widget-system-monitor.component.html',
	styleUrls: ['./widget-system-monitor.component.scss']
})
export class WidgetSystemMonitorComponent implements OnInit {

	@Input() cpuCurrent = 2.4;
	@Input() cpuMax = 4.3;

	@Input() gpuCurrent = 1.8;
	@Input() gpuMax = 3.3;

	@Input() ramCurrent = 15.7;
	@Input() ramMax = 32;

	@Input() hds = [
		{
			title: 'SSD',
			system: true,
			current: 1550,
			max: 2000
		},
		{
			title: 'HDD 1',
			system: false,
			current: 775,
			max: 2000
		}
	]

	constructor() { }

	ngOnInit() {
	}

	getLeftDeg(current, max) {
		const pct = (current / max);
		const deg = 360 * (pct - .5);
		if (pct > .5) {
			return deg;
		} else {
			return 0;
		}
	}

	getRightDeg(current, max) {
		const pct = (current / max);
		const deg = 360 * pct;
		return deg;
	}

	getStackHeight(current, max) {
		const pct = (current / max);
		const height = 100 * pct;
		return height;
	}

	getHDSize(int) {
		if (int < 1000) {
			return int + 'GB';
		} else {
			const tb = int / 1000;
			return tb.toFixed(2) + 'TB';
		}
	}

	getFloorPct(current, max) {
		const pct = Math.floor((current / max)*100);
		return pct;
	}

}
