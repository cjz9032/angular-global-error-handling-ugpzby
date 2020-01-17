import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { SystemStatus } from 'src/app/data-models/gaming/system-status.model';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'app-widget-system-monitor',
	templateUrl: './widget-system-monitor.component.html',
	styleUrls: ['./widget-system-monitor.component.scss']
})
export class WidgetSystemMonitorComponent implements OnInit, OnDestroy {
	public cpuUseFrequency: string;
	public cpuBaseFrequence: string;
	public gpuMemorySize: string;
	public memorySize: string;
	public gpuUsedMemory: string;
	public type: string;
	public isSystemDisk: boolean;
	public capacity: number;
	public hddName: string;
	public usedDisk: number;
	public cpuModuleName: string;
	public cpuover: string;
	public gpuModuleName: string;
	public gpuOver: string;
	public memoryModuleName: string;
	public ramOver: string;
	public ramUsage: number;
	public memoryUsage = 30;
	public showIcon = false;
	public showAllHDs = false;
	public gpuUsage: number;
	public cpuUsage = 1;
	public diskUsage: number;
	public memoryUsed: string;
	public loop: any;
	public gamingCapabilities: any = new GamingAllCapabilities();
	public SystemStatusObj: any = new SystemStatus();
	@Input() cpuCurrent = 0.22;
	@Input() cpuMax = 2.2;
	@Input() gpuCurrent = 0.33;
	@Input() gpuMax = 3.3;
	@Input() ramCurrent = 0;
	@Input() ramMax = 0;
	public hds: any = [
		{
			capacity: 476,
			diskUsage: '14',
			hddName: 'LENSE30512GMSP34MEAT3TA',
			isSystemDisk: 'true',
			type: 'SSD',
			usedDisk: 71
		}
	];
	public defaultHds = [
		{
			capacity: 476,
			diskUsage: '14',
			hddName: 'LENSE30512GMSP34MEAT3TA',
			isSystemDisk: 'true',
			type: 'SSD',
			usedDisk: 71
		}
	];

	constructor(
		private hwInfoService: HwInfoService,
		private commonService: CommonService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private logger: LoggerService
	) {
		this.hds = this.defaultHds;
		if (document.getElementById('menu-main-btn-navbar-toggler')) {
			document.getElementById('menu-main-btn-navbar-toggler').addEventListener('click', (event) => {
				this.toggleHDs(true);
			});
		}
	}

	// CPU Panel Data
	GetcpuBaseFrequencyCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.cpuBaseFrequency);
	}
	SetcpuBaseFrequencyeCache(cpuBaseFrequecnyCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.cpuBaseFrequency, cpuBaseFrequecnyCache);
	}
	GetcpuCapacityCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.cpuCapacity);
	}
	SetcpuCapacityCache(cpuCapacityCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.cpuCapacity, cpuCapacityCache);
	}
	GetcpuUsageCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.cpuUsage, this.cpuUsage);
	}
	SetcpuUsageCache(cpuUsageCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.cpuUsage, cpuUsageCache);
	}
	GetcpuoverCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.cpuOver);
	}
	SetcpuoverCache(cpuOverCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.cpuOver, cpuOverCache);
	}

	// GPU Panel Data
	GetgpuCapacityCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.gpuCapacity);
	}
	SetgpuCapacityCache(gpuCapacityCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.gpuCapacity, gpuCapacityCache);
	}

	GetgpuMaxFrequencyCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.gpuMaxFrequency);
	}
	SetgpuMaxFrequencyCache(gpuMaxFrequenceyCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.gpuMaxFrequency, gpuMaxFrequenceyCache);
	}
	GetgpuUsageCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.gpuUsage, this.gpuCurrent * 100 / this.gpuMax);
	}
	SetgpuUsageCache(gpuUsageCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.gpuUsage, gpuUsageCache);
	}
	GetgpuModulenameCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.gpuModulename);
	}
	SetgpuModulenameCache(gpuModulenameCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.gpuModulename, gpuModulenameCache);
	}

	// Ram Panel Data
	GetmemorySizeCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.memorySize);
	}
	SetmemorySizeCache(memorySizeCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.memorySize, memorySizeCache);
	}
	GetramCapacityCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.ramCapacity);
	}
	SetramCapacityCache(ramCapacityCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.ramCapacity, ramCapacityCache);
	}
	GetramUsageCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.ramUsage, this.memoryUsage);
	}
	SetramUsageCache(ramUsageCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.ramUsage, ramUsageCache);
	}
	GetramaOverCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.ramOver);
	}
	SetramOverCache(ramOverCache) {
		this.commonService.setLocalStorageValue(LocalStorageKey.ramOver, ramOverCache);
	}

	// SSD & HDD Panel
	GetTypeCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.type);
	}
	SetTypeCache(type) {
		this.commonService.setLocalStorageValue(LocalStorageKey.type, type);
	}
	GetCapacityCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.capacity);
	}
	SetCapacityCache(capacity) {
		this.commonService.setLocalStorageValue(LocalStorageKey.capacity, capacity);
	}
	GetDiskUsageCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.diskUsage);
	}
	SetDiskUsageCache(diskUsage) {
		this.commonService.setLocalStorageValue(LocalStorageKey.diskUsage, diskUsage);
	}
	GethddNameCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.hddName);
	}
	SethddNameCache(hddName) {
		this.commonService.setLocalStorageValue(LocalStorageKey.hddName, hddName);
	}

	GetusedDiskkCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.usedDisk);
	}
	SetusedDiskCache(usedDisk) {
		this.commonService.setLocalStorageValue(LocalStorageKey.usedDisk, usedDisk);
	}
	GetisSystemDiskkCache(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.isSystemDisk);
	}
	SetisSystemDiskCache(isSystemDisk) {
		this.commonService.setLocalStorageValue(LocalStorageKey.isSystemDisk, isSystemDisk);
	}

	public getLocalSystemCache() {
		if (this.GetcpuBaseFrequencyCache() !== undefined) {
			this.cpuCurrent = this.GetcpuBaseFrequencyCache();
		}
		if (this.GetcpuCapacityCache() !== undefined) {
			this.cpuMax = this.GetcpuCapacityCache();
		}
		if (this.GetcpuUsageCache() !== undefined) {
			this.cpuUsage = this.GetcpuUsageCache() / 100;
		}
		if (this.GetcpuoverCache() !== undefined) {
			this.cpuover = this.GetcpuoverCache();
		}
		if (this.GetgpuCapacityCache() !== undefined) {
			this.gpuCurrent = this.GetgpuCapacityCache();
		}
		if (this.GetgpuMaxFrequencyCache() !== undefined) {
			this.gpuMax = this.GetgpuMaxFrequencyCache();
		}
		if (this.GetgpuUsageCache() !== undefined) {
			this.gpuUsage = this.getStackHeight(this.GetgpuUsageCache() || 1);
		}
		if (this.GetgpuModulenameCache() !== undefined) {
			this.gpuModuleName = this.GetgpuModulenameCache();
		}
		if (this.GetmemorySizeCache() !== undefined) {
			this.ramCurrent = this.GetmemorySizeCache();
		}
		if (this.GetramCapacityCache() !== undefined) {
			this.ramMax = this.GetramCapacityCache();
		}
		if (this.GetramUsageCache() !== undefined) {
			// this.ramUsage = this.GetramUsageCache();
			this.memoryUsage = this.getStackHeight(this.GetramUsageCache());
			console.log('CACHE MEMORY USAGE => ', this.memoryUsage);
		}
		if (this.GetramaOverCache() !== undefined) {
			this.ramOver = this.GetramaOverCache();
		}
		if (this.GetTypeCache() !== undefined) {
			this.type = this.GetTypeCache();
		}
		if (this.GetCapacityCache() !== undefined) {
			this.capacity = this.GetCapacityCache();
		}
		if (this.GethddNameCache() !== undefined) {
			this.hddName = this.GethddNameCache();
		}
		if (this.GetusedDiskkCache() !== undefined) {
			this.usedDisk = this.GetusedDiskkCache();
		}
		if (this.GetDiskUsageCache() !== undefined) {
			this.diskUsage = this.GetDiskUsageCache();
		}
		if (this.GethddNameCache() !== undefined) {
			this.hddName = this.GethddNameCache();
		}
	}
	public async getDynamicInfoService() {
		try {
			const hwInfo = await this.hwInfoService.getDynamicInformation();
			this.formDynamicInformation(hwInfo);
		} catch (err) { }
	}

	public formDynamicInformation(hwInfo: any) {
		try {
			if (hwInfo.gpuUsage !== null) {
				this.gpuUsage = this.getStackHeight(hwInfo.gpuUsage);
			}
			if (hwInfo.cpuUsage !== null) {
				this.cpuUsage = hwInfo.cpuUsage / 100;
			}
			if (hwInfo.memoryUsage !== null) {
				this.memoryUsage = this.getStackHeight(hwInfo.memoryUsage);
				console.log('UPDATED MEMORY USAGE => ', this.memoryUsage);
			}
			if (hwInfo.cpuUseFrequency !== '') {
				this.cpuCurrent = hwInfo.cpuUseFrequency.split('GHz')[0];
			}

			this.SystemStatusObj.cpuBaseFrequency = this.cpuCurrent;
			this.SystemStatusObj.cpuUsage = hwInfo.cpuUsage;
			if (hwInfo.gpuUsedMemory !== '') {
				this.gpuCurrent = hwInfo.gpuUsedMemory.split('GB')[0];
			}

			this.SystemStatusObj.gpuCapacity = this.gpuCurrent;
			this.SystemStatusObj.gpuUsage = hwInfo.gpuUsage;
			if (hwInfo.memoryUsed !== '') {
				this.ramCurrent = hwInfo.memoryUsed.split('GB')[0];
			}
			this.SystemStatusObj.memorySize = this.ramCurrent;
			this.SystemStatusObj.ramUsage = hwInfo.memoryUsage;
			this.initialiseDisksList(hwInfo.diskList);
			this.setFormDynamicInformationCache(hwInfo);
		} catch (err) { }
	}

	public initialiseDisksList(diskList: any[] = []) {
		this.hds = diskList;
		this.hds.forEach((hd: any) => {
			this.SetisSystemDiskCache(hd.isSystemDisk);
			this.SetCapacityCache(hd.capacity);
			this.SetTypeCache(hd.type);
			this.SethddNameCache(hd.hddName);
			this.SetusedDiskCache(hd.usedDisk);
			this.SetDiskUsageCache(hd.diskUsage);
			if (this.convertToBoolean(hd.isSystemDisk) === true) {
				this.showIcon = true;
			}
		});
		for (let _i = 0; _i < diskList.length; _i++) {
			let hd = JSON.stringify(diskList[_i]);
			if (_i === 0 && this.showIcon === true) {
				diskList[0].isSystemDisk = true;
			} else {
				diskList[_i].isSystemDisk = false;
			}
		}
	}

	public setFormDynamicInformationCache(hwInfo: any) {
		this.commonService.setLocalStorageValue(LocalStorageKey.cpuBaseFrequency, this.cpuCurrent);
		this.commonService.setLocalStorageValue(LocalStorageKey.cpuUsage, hwInfo.cpuUsage);
		this.commonService.setLocalStorageValue(LocalStorageKey.gpuCapacity, this.gpuCurrent);
		this.commonService.setLocalStorageValue(LocalStorageKey.gpuUsage, hwInfo.gpuUsage);
		this.commonService.setLocalStorageValue(LocalStorageKey.memorySize, this.ramCurrent);
		this.commonService.setLocalStorageValue(LocalStorageKey.ramUsage, hwInfo.memoryUsage);
		this.commonService.setLocalStorageValue(LocalStorageKey.disksList, hwInfo.diskList);
	}

	public getMachineInfoService() {
		try {
			this.hwInfoService.getMachineInfomation().then((hwInfo: any) => {
				this.logger.info('getMachineInfo Service: ', hwInfo);
				if (hwInfo.cpuBaseFrequence !== '') {
					this.cpuMax = hwInfo.cpuBaseFrequence;
				}
				this.SystemStatusObj.cpuCapacity = this.cpuMax;
				this.commonService.setLocalStorageValue(LocalStorageKey.cpuCapacity, this.cpuMax);
				if (hwInfo.gpuMemorySize !== '') {
					this.gpuMax = hwInfo.gpuMemorySize;
				}
				this.SystemStatusObj.gpuMaxFrequency = this.gpuMax;
				this.commonService.setLocalStorageValue(LocalStorageKey.gpuMaxFrequency, this.gpuMax);
				if (hwInfo.memorySize) {
					this.ramMax = hwInfo.memorySize;
				}
				this.SystemStatusObj.ramCapacity = this.ramMax;
				this.commonService.setLocalStorageValue(LocalStorageKey.ramCapacity, this.ramMax);
				this.cpuModuleName = hwInfo.cpuModuleName;
				this.cpuover = this.cpuModuleName;
				this.SystemStatusObj.cpuOver = this.cpuModuleName;
				this.commonService.setLocalStorageValue(LocalStorageKey.cpuOver, this.cpuModuleName);
				this.gpuModuleName = hwInfo.gpuModuleName;
				this.gpuOver = this.gpuModuleName;
				this.SystemStatusObj.gpuOver = this.gpuModuleName;
				this.commonService.setLocalStorageValue(LocalStorageKey.gpuOver, this.gpuOver);
				this.memoryModuleName = hwInfo.memoryModuleName;
				this.ramOver = this.memoryModuleName;
				this.SystemStatusObj.ramOver = this.ramOver;
				this.commonService.setLocalStorageValue(LocalStorageKey.ramOver, this.ramOver);
			});
		} catch (error) { }
	}

	convertToBoolean(input: string): boolean | undefined {
		try {
			return JSON.parse(input);
		} catch (e) {
			return undefined;
		}
	}

	ngOnInit() {
		this.gamingCapabilities.cpuInfoFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.cpuInfoFeature
		);
		this.gamingCapabilities.gpuInfoFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.gpuInfoFeature
		);
		this.gamingCapabilities.memoryInfoFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.memoryInfoFeature
		);
		this.gamingCapabilities.hddInfoFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.hddInfoFeature
		);
		this.hds = this.defaultHds;
		this.initialiseDisksList(this.commonService.getLocalStorageValue(LocalStorageKey.disksList, this.defaultHds));
		this.getLocalSystemCache();
		this.getDynamicInfoService();
		this.getMachineInfoService();
		this.loop = setInterval(() => {
			this.getDynamicInfoService();
		}, 5000);
	}

	ngOnDestroy() {
		clearInterval(this.loop);
	}

	toggleHDs(canClose = false) {
		if (canClose) {
			this.showAllHDs = false;
		} else if (this.hds.length > 2) {
			this.showAllHDs = !this.showAllHDs;
		}
	}

	getLeftDeg(pct) {
		if (pct > 1) {
			pct = 1;
		}
		const deg = parseFloat((360 * (pct - 0.5)).toFixed(1));
		if (pct > 0.5) {
			return deg;
		} else {
			return 0;
		}
	}

	getRightDeg(pct) {
		if (pct > 1) {
			pct = 1;
		}
		if (pct < 0) {
			pct = 0;
		}
		const deg = parseFloat((360 * pct).toFixed(1));
		return deg;
	}

	getStackHeight(pct) {
		if (pct > 100) {
			pct = 100;
		}
		if (pct < 0) {
			pct = 0;
		}
		const height = 100 - pct;
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
		const pct = Math.floor(current / max * 100);
		return pct;
	}
}
