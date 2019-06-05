import { Component, OnInit, Input } from '@angular/core';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';

@Component({
	selector: 'app-widget-system-monitor',
	templateUrl: './widget-system-monitor.component.html',
	styleUrls: ['./widget-system-monitor.component.scss']
})
export class WidgetSystemMonitorComponent implements OnInit {
	public cpuUseFrequency: string;
	public cpuBaseFrequence: string;
	public gpuMaxFrequence: string;
	public memorySize: string;
	public gpuUseFrequency: string;
	public memoryUsed: string;
	public type: string;
	public isSystemDisk: boolean;
	public capacity: number;
	public usedDisk: number;
	public cpuModuleName: string;


	@Input() cpuCurrent = 2.4;
	@Input() cpuMax = 0;

	@Input() gpuCurrent = 1.8;
	@Input() gpuMax = 3.3;

	@Input() ramCurrent = 15.7;
	@Input() ramMax = 32;
	@Input() cpuover = 'Intel';

	public hds: any;
	constructor(private hwInfoService: HwInfoService) { }
	public getDynamicInfoService() {
		this.hwInfoService.getDynamicInformation().then((hwInfo: any) => {
			console.log('getDynamicInfoService js bridge ------------------------>', JSON.stringify(hwInfo));
			this.cpuUseFrequency = hwInfo.cpuUseFrequency.split('GHz')[0];;
			this.cpuCurrent = parseFloat(this.cpuUseFrequency);
			this.gpuUseFrequency = hwInfo.gpuUseFrequency.split('GB')[0];;
			this.gpuCurrent = parseFloat(this.gpuUseFrequency);
			this.memoryUsed = hwInfo.memoryUsed.split('GB')[0];;
			this.ramCurrent = parseFloat(this.memoryUsed);
			this.hds = hwInfo.diskList;
		});
	}

	public getMachineInfoService() {
		try {
			this.hwInfoService.getMachineInfomation().then((hwInfo: any) => {
				console.log('getMachineInfoService js bridge ------------------------>', JSON.stringify(hwInfo));
				this.cpuBaseFrequence = hwInfo.cpuBaseFrequence.split('GHz')[0];
				this.cpuMax = parseFloat(this.cpuBaseFrequence);
				this.gpuMaxFrequence = hwInfo.gpuMaxFrequence.split('GB')[0];
				this.gpuMax = parseFloat(this.gpuMaxFrequence);
				this.memorySize = hwInfo.memorySize.split('GB')[0];
				this.ramMax = parseFloat(this.memorySize);
				this.cpuModuleName = hwInfo.cpuModuleName;
				this.cpuover = this.cpuModuleName;
			});
		} catch (error) {
			console.error(error.message);
		}
	}

	ngOnInit() {

		this.getDynamicInfoService();
		this.getMachineInfoService();
		const self = this;
		const loop = setInterval(function () {
			self.getDynamicInfoService();
		}, 5000);
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
		const mask = 1 - pct;
		const height = 100 * mask;
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
