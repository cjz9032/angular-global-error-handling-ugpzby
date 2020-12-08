import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { SystemStatus } from 'src/app/data-models/gaming/system-status.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-widget-system-monitor',
	templateUrl: './widget-system-monitor.component.html',
	styleUrls: ['./widget-system-monitor.component.scss'],
})
export class WidgetSystemMonitorComponent implements OnInit, OnDestroy {
	@Input() cpuCurrent = 0.22;
	@Input() cpuMax = 2.2;
	@Input() gpuCurrent = 0.33;
	@Input() gpuMax = 3.3;
	@Input() ramCurrent = 0;
	@Input() ramMax = 0;

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
	public systemStatusObj: any = new SystemStatus();

	public hds: any = [
		{
			capacity: 476,
			diskUsage: '14',
			hddName: 'LENSE30512GMSP34MEAT3TA',
			isSystemDisk: 'true',
			type: 'SSD',
			usedDisk: 71,
		},
	];
	public defaultHds = [
		{
			capacity: 476,
			diskUsage: '14',
			hddName: 'LENSE30512GMSP34MEAT3TA',
			isSystemDisk: 'true',
			type: 'SSD',
			usedDisk: 71,
		},
	];

	constructor(
		private hwInfoService: HwInfoService,
		private localCacheService: LocalCacheService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private logger: LoggerService
	) {
		this.hds = this.defaultHds;
	}

	// CPU Panel Data
	getCPUBaseFrequencyCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuBaseFrequency);
	}
	setCPUBaseFrequencyeCache(cpuBaseFrequecnyCache) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.cpuBaseFrequency,
			cpuBaseFrequecnyCache
		);
	}
	getCPUCapacityCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuCapacity);
	}
	setCPUCapacityCache(cpuCapacityCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuCapacity, cpuCapacityCache);
	}
	getCPUUsageCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuUsage, this.cpuUsage);
	}
	setCPUUsageCache(cpuUsageCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuUsage, cpuUsageCache);
	}
	getCPUOverCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuOver);
	}
	setCPUOverCache(cpuOverCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuOver, cpuOverCache);
	}

	// GPU Panel Data
	getGPUCapacityCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuCapacity);
	}
	setGPUCapacityCache(gpuCapacityCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuCapacity, gpuCapacityCache);
	}

	getGPUMaxFrequencyCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuMaxFrequency);
	}
	setGPUMaxFrequencyCache(gpuMaxFrequenceyCache) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.gpuMaxFrequency,
			gpuMaxFrequenceyCache
		);
	}
	getGPUUsageCache(): any {
		return this.localCacheService.getLocalCacheValue(
			LocalStorageKey.gpuUsage,
			(this.gpuCurrent * 100) / this.gpuMax
		);
	}
	setGPUUsageCache(gpuUsageCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuUsage, gpuUsageCache);
	}
	getGPUModulenameCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuModulename);
	}
	setGOUModulenameCache(gpuModulenameCache) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.gpuModulename,
			gpuModulenameCache
		);
	}

	// Ram Panel Data
	getMemorySizeCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.memorySize);
	}
	setMemorySizeCache(memorySizeCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.memorySize, memorySizeCache);
	}
	getRamCapacityCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.ramCapacity);
	}
	setRamCapacityCache(ramCapacityCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ramCapacity, ramCapacityCache);
	}
	getRamUsageCache(): any {
		return this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ramUsage,
			this.memoryUsage
		);
	}
	setRamUsageCache(ramUsageCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ramUsage, ramUsageCache);
	}
	getRamOverCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.ramOver);
	}
	setRamOverCache(ramOverCache) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ramOver, ramOverCache);
	}

	// SSD & HDD Panel
	getTypeCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.type);
	}
	setTypeCache(type) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.type, type);
	}
	getCapacityCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.capacity);
	}
	setCapacityCache(capacity) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.capacity, capacity);
	}
	getDiskUsageCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.diskUsage);
	}
	setDiskUsageCache(diskUsage) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.diskUsage, diskUsage);
	}
	getHDDNameCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.hddName);
	}
	setHDDNameCache(hddName) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.hddName, hddName);
	}

	getUsedDiskCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.usedDisk);
	}
	setUsedDiskCache(usedDisk) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.usedDisk, usedDisk);
	}
	getIsSystemDiskCache(): any {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.isSystemDisk);
	}
	setIsSystemDiskCache(isSystemDisk) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.isSystemDisk, isSystemDisk);
	}

	public getLocalSystemCache() {
		if (this.getCPUBaseFrequencyCache() !== undefined) {
			this.cpuCurrent = this.getCPUBaseFrequencyCache();
		}
		if (this.getCPUCapacityCache() !== undefined) {
			this.cpuMax = this.getCPUCapacityCache();
		}
		if (this.getCPUUsageCache() !== undefined) {
			this.cpuUsage = this.getCPUUsageCache() / 100;
		}
		if (this.getCPUOverCache() !== undefined) {
			this.cpuover = this.getCPUOverCache();
		}
		if (this.getGPUCapacityCache() !== undefined) {
			this.gpuCurrent = this.getGPUCapacityCache();
		}
		if (this.getGPUMaxFrequencyCache() !== undefined) {
			this.gpuMax = this.getGPUMaxFrequencyCache();
		}
		if (this.getGPUUsageCache() !== undefined) {
			this.gpuUsage = this.getStackHeight(this.getGPUUsageCache() || 1);
		}
		if (this.getGPUModulenameCache() !== undefined) {
			this.gpuModuleName = this.getGPUModulenameCache();
		}
		if (this.getMemorySizeCache() !== undefined) {
			this.ramCurrent = this.getMemorySizeCache();
		}
		if (this.getRamCapacityCache() !== undefined) {
			this.ramMax = this.getRamCapacityCache();
		}
		if (this.getRamUsageCache() !== undefined) {
			// this.ramUsage = this.GetramUsageCache();
			this.memoryUsage = this.getStackHeight(this.getRamUsageCache());
		}
		if (this.getRamOverCache() !== undefined) {
			this.ramOver = this.getRamOverCache();
		}
		if (this.getTypeCache() !== undefined) {
			this.type = this.getTypeCache();
		}
		if (this.getCapacityCache() !== undefined) {
			this.capacity = this.getCapacityCache();
		}
		if (this.getHDDNameCache() !== undefined) {
			this.hddName = this.getHDDNameCache();
		}
		if (this.getUsedDiskCache() !== undefined) {
			this.usedDisk = this.getUsedDiskCache();
		}
		if (this.getDiskUsageCache() !== undefined) {
			this.diskUsage = this.getDiskUsageCache();
		}
		if (this.getHDDNameCache() !== undefined) {
			this.hddName = this.getHDDNameCache();
		}
	}
	public async getDynamicInfoService() {
		try {
			const hwInfo = await this.hwInfoService.getDynamicInformation();
			this.formDynamicInformation(hwInfo);
		} catch (err) {}
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
			}
			if (hwInfo.cpuUseFrequency !== '') {
				this.cpuCurrent = hwInfo.cpuUseFrequency.split('GHz')[0];
			}

			this.systemStatusObj.cpuBaseFrequency = this.cpuCurrent;
			this.systemStatusObj.cpuUsage = hwInfo.cpuUsage;
			if (hwInfo.gpuUsedMemory !== '') {
				this.gpuCurrent = hwInfo.gpuUsedMemory.split('GB')[0];
			}

			this.systemStatusObj.gpuCapacity = this.gpuCurrent;
			this.systemStatusObj.gpuUsage = hwInfo.gpuUsage;
			if (hwInfo.memoryUsed !== '') {
				this.ramCurrent = hwInfo.memoryUsed.split('GB')[0];
			}
			this.systemStatusObj.memorySize = this.ramCurrent;
			this.systemStatusObj.ramUsage = hwInfo.memoryUsage;
			this.initialiseDisksList(hwInfo.diskList);
			this.setFormDynamicInformationCache(hwInfo);
		} catch (err) {}
	}

	public initialiseDisksList(diskList: any[] = []) {
		this.hds = diskList;
		this.hds.forEach((hd: any) => {
			this.setIsSystemDiskCache(hd.isSystemDisk);
			this.setCapacityCache(hd.capacity);
			this.setTypeCache(hd.type);
			this.setHDDNameCache(hd.hddName);
			this.setUsedDiskCache(hd.usedDisk);
			this.setDiskUsageCache(hd.diskUsage);
			if (this.convertToBoolean(hd.isSystemDisk) === true) {
				this.showIcon = true;
			}
		});
		for (let i = 0; i < diskList.length; i++) {
			const hd = JSON.stringify(diskList[i]);
			if (i === 0 && this.showIcon === true) {
				diskList[0].isSystemDisk = true;
			} else {
				diskList[i].isSystemDisk = false;
			}
		}
	}

	public setFormDynamicInformationCache(hwInfo: any) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.cpuBaseFrequency,
			this.cpuCurrent
		);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuUsage, hwInfo.cpuUsage);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuCapacity, this.gpuCurrent);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuUsage, hwInfo.gpuUsage);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.memorySize, this.ramCurrent);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ramUsage, hwInfo.memoryUsage);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.disksList, hwInfo.diskList);
	}

	public getMachineInfoService() {
		try {
			this.hwInfoService.getMachineInfomation().then((hwInfo: any) => {
				this.logger.info('getMachineInfo Service: ', hwInfo);
				if (hwInfo.cpuBaseFrequence !== '') {
					this.cpuMax = hwInfo.cpuBaseFrequence;
				}
				this.systemStatusObj.cpuCapacity = this.cpuMax;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuCapacity, this.cpuMax);
				if (hwInfo.gpuMemorySize !== '') {
					this.gpuMax = hwInfo.gpuMemorySize;
				}
				this.systemStatusObj.gpuMaxFrequency = this.gpuMax;
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.gpuMaxFrequency,
					this.gpuMax
				);
				if (hwInfo.memorySize) {
					this.ramMax = hwInfo.memorySize;
				}
				this.systemStatusObj.ramCapacity = this.ramMax;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.ramCapacity, this.ramMax);
				this.cpuModuleName = hwInfo.cpuModuleName;
				this.cpuover = this.cpuModuleName;
				this.systemStatusObj.cpuOver = this.cpuModuleName;
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.cpuOver,
					this.cpuModuleName
				);
				this.gpuModuleName = hwInfo.gpuModuleName;
				this.gpuOver = this.gpuModuleName;
				this.systemStatusObj.gpuOver = this.gpuModuleName;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuOver, this.gpuOver);
				this.memoryModuleName = hwInfo.memoryModuleName;
				this.ramOver = this.memoryModuleName;
				this.systemStatusObj.ramOver = this.ramOver;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.ramOver, this.ramOver);
			});
		} catch (error) {}
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
		this.initialiseDisksList(
			this.localCacheService.getLocalCacheValue(LocalStorageKey.disksList, this.defaultHds)
		);
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
		const pct = Math.floor((current / max) * 100);
		return pct;
	}
}
