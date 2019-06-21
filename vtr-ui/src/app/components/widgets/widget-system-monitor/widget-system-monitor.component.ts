import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { SystemStatus } from 'src/app/data-models/gaming/system-status.model'

@Component({
	selector: 'app-widget-system-monitor',
	templateUrl: './widget-system-monitor.component.html',
	styleUrls: ['./widget-system-monitor.component.scss']
})
export class WidgetSystemMonitorComponent implements OnInit {
	public cpuUseFrequency: string;
	public cpuBaseFrequence: string;
	public gpuMemorySize: string;
	public memorySize: string;
	public gpuUsedMemory: string;
	public memoryUsed: string;
	public type: string;
	public isSystemDisk: boolean;
	public capacity: number;
	public usedDisk: number;
	public cpuModuleName: string;
	public cpuover: string;
	public gpuModuleName: string;
	public gpuOver: string;
	public memoryModuleName: string;
	public ramOver: string;
	public showIcon: boolean = false;
	public showAllHDs = false;
	public stathds : any=[];


	@Input() cpuCurrent = 2.4;
	@Input() cpuMax = 0;

	@Input() gpuCurrent = 1.8;
	@Input() gpuMax = 3.3;

	@Input() ramCurrent = 15.7;
	@Input() ramMax = 32;
	//@Input() cpuover = 'Intel';

	//public hds: any=[];

	@Input() hds = [
		{
			isSystemDisk: "false",
			capacity: 476,
			type: "SSD",
			hddName: "LENSE30512GMSP34MEAT3TA",
			usedDisk: "71",
			diskUsage: "14"

		},
		{
			isSystemDisk: "false",
			capacity: 476,
			type: "HDD",
			hddName: "LENSE30512GMSP34MEAT3TA",
			usedDisk: "71",
			diskUsage: "14"
		},
		{
			isSystemDisk: "true",
			capacity: 476,
			type: "HDD",
			hddName: "LENSE30512GMSP34MEAT3TA",
			usedDisk: "71",
			diskUsage: "14"
		},
		{
			isSystemDisk: "true",
			capacity: 476,
			type: "SSD",
			hddName: "LENSE30512GMSP34MEAT3TA",
			usedDisk: "71",
			diskUsage: "14"
		},
		{
			isSystemDisk: "false",
			capacity: 476,
			type: "SSD",
			hddName: "LENSE30512GMSP34MEAT3TA",
			usedDisk: "71",
			diskUsage: "14"
		}
	];

	constructor(private hwInfoService: HwInfoService) { }
	public getDynamicInfoService() {
		this.hwInfoService.getDynamicInformation().then((hwInfo: any) => {
			//console.log('getDynamicInfoService js bridge ------------------------>', JSON.stringify(hwInfo));
			//console.log('DYNAMIC SYSTEM INFO', hwInfo);
			if (hwInfo.cpuUseFrequency !== '') {
				this.cpuUseFrequency = hwInfo.cpuUseFrequency.split('GHz')[0];
			}
			this.cpuCurrent = parseFloat(this.cpuUseFrequency);
			if (hwInfo.gpuUsedMemory !== '') {
				this.gpuUsedMemory = hwInfo.gpuUsedMemory.split('GB')[0];
			}
			this.gpuCurrent = parseFloat(this.gpuUsedMemory);
			if (hwInfo.memoryUsed !== '') {
				this.memoryUsed = hwInfo.memoryUsed.split('GB')[0];
			}
			this.ramCurrent = parseFloat(this.memoryUsed);
			//this.stathds = hwInfo.diskList;
			this.stathds = this.hds;
			//console.log("murali" + JSON.stringify(hwInfo.diskList));
			this.stathds.forEach((hd) => {
				if (this.convertToBoolean(hd.isSystemDisk) === true) {
					this.showIcon = true;
				}
			});
			for (var _i = 0; _i < this.stathds.length; _i++) {
				var hd = JSON.stringify(this.stathds[_i]);
				if (_i === 0 && this.showIcon === true) {
					this.stathds[0].isSystemDisk = true;
				}
				else {
					this.stathds[_i].isSystemDisk = false;
				}
			}

		});
	}

	public getMachineInfoService() {
		try {
			this.hwInfoService.getMachineInfomation().then((hwInfo: any) => {
				//console.log('getMachineInfoService js bridge ------------------------>', JSON.stringify(hwInfo));
				if (hwInfo.cpuBaseFrequence !== '') {
					this.cpuBaseFrequence = hwInfo.cpuBaseFrequence.split('GHz')[0];
				}
				this.cpuMax = parseFloat(this.cpuBaseFrequence);
				if (hwInfo.gpuMemorySize !== '') {
					this.gpuMemorySize = hwInfo.gpuMemorySize.split('GB')[0];
				}
				this.gpuMax = parseFloat(this.gpuMemorySize);
				if (hwInfo.memorySize !== '') {
					this.memorySize = hwInfo.memorySize.split('GB')[0];
				}
				this.ramMax = parseFloat(this.memorySize);
				this.cpuModuleName = hwInfo.cpuModuleName;
				this.cpuover = this.cpuModuleName;
				this.gpuModuleName = hwInfo.gpuModuleName;
				this.gpuOver = this.gpuModuleName;
				this.memoryModuleName = hwInfo.memoryModuleName;
				this.ramOver = this.memoryModuleName;
			});
		} catch (error) {
			console.error(error.message);
		}
	}


	convertToBoolean(input: string): boolean | undefined {
		try {
			return JSON.parse(input);
		}
		catch (e) {
			return undefined;
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

	toggleHDs(event) {
		if (this.hds.length > 1) {
			this.showAllHDs = !this.showAllHDs;
		}
	}

	getLeftDeg(current, max) {
		let pct = (current / max);
		const deg = 360 * (pct - .5);
		if (pct > 1) {
			pct = 1;
		}
		if (pct > .5) {
			return deg;
		} else {
			return 0;
		}
	}

	getRightDeg(current, max) {
		let pct = (current / max);
		if (pct > 1) {
			pct = 1;
		}
		const deg = 360 * pct;
		return deg;
	}

	getStackHeight(current, max) {
		let pct = (current / max);
		if (pct > 1) {
			pct = 1;
		}
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
		const pct = Math.floor((current / max) * 100);
		return pct;
	}

}
