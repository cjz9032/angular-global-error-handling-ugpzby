import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import SystemStatus from 'src/app/data-models/gaming/system-status.model';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonService } from 'src/app/services/common/common.service';
import { Gaming } from 'src/app/enums/gaming.enum';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';

@Component({
	selector: 'vtr-widget-system-monitor',
	templateUrl: './widget-system-monitor.component.html',
	styleUrls: ['./widget-system-monitor.component.scss'],
})
export class WidgetSystemMonitorComponent implements OnInit, OnDestroy {
	public cpuModuleName = 'N/A';
	public cpuBaseFrequency = '2.0GHz';
	public cpuCurrentFrequency = '2';
	public cpuUsage = 1;
	public gpuModuleName = 'N/A';
	public gpuMemorySize = '8GB';
	public gpuUsedMemory = '4';
	public gpuUsage = 0;
	public ramModuleName = 'N/A';
	public ramSize = '16GB';
	public ramUsed = '4';
	public ramUsage = 0;
	public hds: any = [
		{
			capacity: 476,
			diskUsage: '14',
			hddName: 'LENSE30512GMSP34MEAT3TA',
			isSystemDisk: true,
			type: 'SSD',
			usedDisk: 71,
		}
	];
	public showAllHDs = false;
	public loop: any;

	// TODO version 3.6 new tips
	public cpuInfo = {
		isOverClocking: false,
		modal: 'cpuModuleName',
		frequency: '1/1Ghz',
		usage: '0%',
		isSupportOCFeature: true,
	};
	public gpuInfo = {
		isOverClocking: false,
		modal: 'gpuModuleName',
		frequency: '1/1Ghz',
		usage: '',
		isSupportOCFeature: true
	};
	public vramInfo = {
		isOverClocking: false,
		modal: 'memoryModuleName',
		frequency: '1/1Ghz',
		usage: '',
		isSupportOCFeature: true,
	};

	// TODO version 3.6 new design for cpu/gpu/vram
	public hwVersionInfo = 0; // (cpuInfoVersion === 1 && gpuInfoVersion === 1) ===> 1
	public hwOCInfo = JSON.parse(JSON.stringify(SystemStatus.hwOverClockInfo));
	private hwMachineInfo: any;
	public ocStateEvent: any;
	private notifcationSubscription: Subscription;
	public stringRamOrVram = 'RAM';
	private isOCEventBind = false;
	private gamingCapabilities: any;
	private cpuUtilization = '10%';

	constructor(
		private hwInfoService: HwInfoService,
		private localCacheService: LocalCacheService,
		private logger: LoggerService,
		private shellServices: VantageShellService,
		private commonService: CommonService,
		private ngZone: NgZone,
		private gamingOCService: GamingOCService,
	) {
		this.ocStateEvent = this.onRegisterOverClockStateChangeEvent.bind(this);
	}

	ngOnInit() {
		//////////////////////////////////////////////////////////////////////
		// Get machine info from cache                                      //
		// Feature 0: CPU module name, base & current frequece, usage       //
		// Feature 1: GPU module name, memory size & used, usage            //
		// Feature 2: RAM module name, memory size & used, usage            //
		//////////////////////////////////////////////////////////////////////
		this.cpuModuleName = this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuModuleName, 'N/A');
		this.cpuCurrentFrequency = this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuCurrentFrequency, 0.22);
		this.cpuBaseFrequency = this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuBaseFrequency, '2.2GHz');
		this.cpuUsage = this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuUsage, this.cpuUsage) / 100;
		this.gpuModuleName = this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuModuleName, 'N/A');
		this.gpuUsedMemory = this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuUsedMemory, 4);
		this.gpuUsage = this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuUsage, 0);
		this.ramModuleName = this.localCacheService.getLocalCacheValue(LocalStorageKey.ramModuleName, 'N/A');
		this.ramUsed = this.localCacheService.getLocalCacheValue(LocalStorageKey.ramUsed, 0);
		this.ramUsage = this.localCacheService.getLocalCacheValue(LocalStorageKey.ramUsage, 0);
		this.hds = this.localCacheService.getLocalCacheValue(LocalStorageKey.disksList, this.hds);
		// Get hard ware version info from cache, cpuInfoVersion === 1 && gpuInfoVersion === 1
		this.hwVersionInfo = (this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuInfoVersion, 0) === 1
			&& this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuInfoVersion, 0) === 1) ? 1 : 0;
		// Get hard ware overclock feature support from cache
		Object.keys(this.hwOCInfo).forEach(
			(key) => this.hwOCInfo[key].isSupportOCFeature = this.localCacheService.getLocalCacheValue(this.hwOCInfo[key].featureLocalCache, false)
			&& this.localCacheService.getLocalCacheValue(this.hwOCInfo[key].driverLocalCache, false)
		);
		if (this.hwVersionInfo === 1) {
			this.cpuInfo.isSupportOCFeature = this.hwOCInfo.cpuOverClockInfo.isSupportOCFeature;
			this.gpuInfo.isSupportOCFeature = this.hwOCInfo.gpuOverClockInfo.isSupportOCFeature;
			this.vramInfo.isSupportOCFeature = this.hwOCInfo.vramOverClockInfo.isSupportOCFeature;
		}
		this.gpuMemorySize = this.updateUnitOfValue(this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuMemorySize, '8'));
		this.ramSize = this.updateUnitOfValue(this.localCacheService.getLocalCacheValue(LocalStorageKey.ramSize, '16'));
		this.cpuUtilization = this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuUtilization, '10%');

		this.updateTooltips();
		this.notifcationSubscription = this.commonService
			.getCapabalitiesNotification()
			.subscribe((response) => {
				if (response.type === Gaming.GamingCapabilities && response.payload) {
					this.gamingCapabilities = response.payload;
					this.hwOCInfo.cpuOverClockInfo.isSupportOCFeature = this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.xtuService;
					this.hwOCInfo.gpuOverClockInfo.isSupportOCFeature = this.gamingCapabilities.gpuCoreOCFeature && this.gamingCapabilities.nvDriver;
					this.hwOCInfo.vramOverClockInfo.isSupportOCFeature = this.gamingCapabilities.gpuVramOCFeature && this.gamingCapabilities.nvDriver;
					this.hwVersionInfo = (this.gamingCapabilities.cpuInfoVersion === 1 && this.gamingCapabilities.gpuInfoVersion === 1) ? 1 : 0;
					this.initHWOverClockInfo();
					if (this.hwVersionInfo === 1 && (this.hwOCInfo.cpuOverClockInfo.isSupportOCFeature
						|| this.hwOCInfo.gpuOverClockInfo.isSupportOCFeature || this.hwOCInfo.vramOverClockInfo.isSupportOCFeature)) {
						this.gamingOCService.regOCRealStatusChangeEvent();
					} // ensure event registration
					if (this.hwVersionInfo === 1) {
						this.cpuInfo.isSupportOCFeature = this.hwOCInfo.cpuOverClockInfo.isSupportOCFeature;
						this.gpuInfo.isSupportOCFeature = this.hwOCInfo.gpuOverClockInfo.isSupportOCFeature;
						this.vramInfo.isSupportOCFeature = this.hwOCInfo.vramOverClockInfo.isSupportOCFeature;
					}
					this.gpuMemorySize = this.updateUnitOfValue(this.gpuMemorySize);
					this.ramSize = this.updateUnitOfValue(this.ramSize);
				}
			});
		this.initHWOverClockInfo();
		//////////////////////////////////////////////////////////////////////
		// Get machine info from JSBridge                                   //
		// Feature 0: Get CPU & GPU & Ram info                              //
		// Feature 1: GPU module name, memory size & used, usage            //
		// Feature 2: RAM module name, memory size & used, usage            //
		//////////////////////////////////////////////////////////////////////
		this.getRealTimeUsageInfo();
		this.loop = setInterval(() => {
			this.getRealTimeUsageInfo();
		}, 5000);
	}

	ngOnDestroy() {
		clearInterval(this.loop);
		this.loop = null;
		if (this.notifcationSubscription) {
			this.notifcationSubscription.unsubscribe();
		}
		if (this.hwVersionInfo === 1 && (this.hwOCInfo.cpuOverClockInfo.isSupportOCFeature || this.hwOCInfo.gpuOverClockInfo.isSupportOCFeature
			|| this.hwOCInfo.vramOverClockInfo.isSupportOCFeature) && this.isOCEventBind) {
				this.unRegisterOverClockStateChangeEvent();
			}
	}

	//////////////////////////////////////////////////////////////////////
	// get machine hardware version info                                //
	// get hardware oc state info                                       //
	// register state event                                             //
	//////////////////////////////////////////////////////////////////////
	public initHWOverClockInfo() {
		this.stringRamOrVram = this.hwVersionInfo === 1 ? 'VRAM' : 'RAM';
		const registerEventFlag = this.hwVersionInfo === 1 && (this.hwOCInfo.cpuOverClockInfo.isSupportOCFeature
			|| this.hwOCInfo.gpuOverClockInfo.isSupportOCFeature || this.hwOCInfo.vramOverClockInfo.isSupportOCFeature);
		if (registerEventFlag && !this.isOCEventBind) {
			this.registerOverClockStateChangeEvent();
			this.getHwOverClockState();
		} else if (!registerEventFlag && this.isOCEventBind) {
			this.unRegisterOverClockStateChangeEvent();
		}
		this.getMachineInfo();
	}

	//////////////////////////////////////////////////////////////////////
	// Get Machine Info                                                 //
	// 1. CPU module name, base frequence                               //
	// 2. GPU module name, memory size                                  //
	// 3. RAM module name, memory size                                  //
	//////////////////////////////////////////////////////////////////////
	public getMachineInfo() {
		if (this.hwVersionInfo === 1) {
			this.getHardwareInformation();
			return;
		}
		try {
			this.hwInfoService.getMachineInfomation().then((hwInfo: any) => {
				this.logger.info('Widget-SystemMonitor-GetMachineInfo: ', hwInfo);
				// Get CPU info
				if (this.cpuModuleName !== hwInfo.cpuModuleName && hwInfo.cpuModuleName !== '') {
					this.cpuModuleName = hwInfo.cpuModuleName;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.cpuModuleName,
						this.cpuModuleName
					);
				}
				if (this.cpuBaseFrequency !== hwInfo.cpuBaseFrequence && hwInfo.cpuBaseFrequence !== '') {
					this.cpuBaseFrequency = hwInfo.cpuBaseFrequence;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.cpuBaseFrequency,
						this.cpuBaseFrequency
					);
				}

				// Get GPU Info
				if (this.gpuModuleName !== hwInfo.gpuModuleName && hwInfo.gpuModuleName !== '') {
					this.gpuModuleName = hwInfo.gpuModuleName;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.gpuModuleName,
						this.gpuModuleName
					);
				}
				if (this.gpuMemorySize !== hwInfo.gpuMemorySize && hwInfo.gpuMemorySize !== '') {
					this.gpuMemorySize = hwInfo.gpuMemorySize;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.gpuMemorySize,
						this.gpuMemorySize
					);
				}

				// Get Memory info
				if (this.ramModuleName !== hwInfo.memoryModuleName && hwInfo.memoryModuleName !== '') {
					this.ramModuleName = hwInfo.memoryModuleName;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.ramModuleName,
						this.ramModuleName
					);
				}
				if (this.ramSize !== hwInfo.memorySize && hwInfo.memorySize !== '') {
					this.ramSize = hwInfo.memorySize;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.ramSize,
						this.ramSize
					);
				}
			});
		} catch (err) {
			this.logger.error('Widget-SystemMonitor-GetMachineInfo error: ', err.message);
		}
	}

	// hwInfo:
	// {cpuModuleName: 'AMD Ryzen', gpuModuleName: 'NVDIA GeForce', cpuMaxFrequency: 3.2, gpuCoreMaxFrequency: 3.2, gpuVramMaxFrequency: 3.2}
    // cpuMaxFrequency/gpuCoreMaxFrequency/gpuVramMaxFrequency: unit is GHz
	public getHardwareInformation() {
		try {
			this.hwInfoService.getHardwareInformation().then((hwInfo: any) => {
				this.logger.info('Widget-SystemMonitor-getHardwareInformation: ', hwInfo);
				if (!hwInfo) { return; }
				this.hwMachineInfo = hwInfo;
				// Get CPU info
				if (this.isAvailiableValue(hwInfo.cpuModuleName) && this.cpuModuleName !== hwInfo.cpuModuleName) {
					this.cpuModuleName = hwInfo.cpuModuleName;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuModuleName, this.cpuModuleName);
				}
				if (this.isAvailiableNumber(hwInfo.cpuMaxFrequency)) {
					this.cpuBaseFrequency = this.stringForNumber(hwInfo.cpuMaxFrequency) + 'GHz';
					this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuBaseFrequency, this.cpuBaseFrequency);
				}

				// Get GPU/Memory Info
				if (this.isAvailiableValue(hwInfo.cpuModuleName) && this.gpuModuleName !== hwInfo.gpuModuleName) {
					this.gpuModuleName = hwInfo.gpuModuleName;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuModuleName, this.gpuModuleName);
					this.ramModuleName = hwInfo.gpuModuleName;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.ramModuleName, this.ramModuleName);
				}
				if (this.isAvailiableNumber(hwInfo.gpuCoreMaxFrequency)) {
					this.gpuMemorySize = this.stringForNumber(hwInfo.gpuCoreMaxFrequency) + 'GHz';
					this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuMemorySize, this.gpuMemorySize);
				}
				if (this.isAvailiableNumber(hwInfo.gpuVramMaxFrequency)) {
					this.ramSize = this.stringForNumber(hwInfo.gpuVramMaxFrequency) + 'GHz';
					this.localCacheService.setLocalCacheValue(LocalStorageKey.ramSize, this.ramSize);
				}
				this.updateTooltips();
			});
		} catch (err) {
			this.logger.error('Widget-SystemMonitor-GetMachineInfo error: ', err.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Get real time Info & set local cache                             //
	// 1. CPU current frequence & usage                                 //
	// 2. GPU used memory & usage                                       //
	// 3. RAM used memory & usage                                       //
	// 4. Disk list(name, type, isSystemDisk, capacity, used, usage)    //
	//////////////////////////////////////////////////////////////////////
	public getRealTimeUsageInfo() {
		if (this.hwVersionInfo === 1) {
			this.getDynamicHardwareUsageInfo();
			return;
		}
		try {
			this.hwInfoService.getDynamicInformation().then( hwInfo => {
				this.logger.info('Widget-SystemMonitor-getReamTimeUsageInfo: ', hwInfo);
				if (hwInfo.cpuUseFrequency !== null) {
					this.cpuCurrentFrequency = hwInfo.cpuUseFrequency.split('GHz')[0];
					this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuCurrentFrequency, this.cpuCurrentFrequency);
				}
				if(hwInfo.cpuUsage !== null) {
					this.cpuUsage = hwInfo.cpuUsage / 100;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuUsage, hwInfo.cpuUsage);
				}
				if (hwInfo.gpuUsedMemory !== null) {
					this.gpuUsedMemory = hwInfo.gpuUsedMemory.split('GB')[0];
					this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuUsedMemory, this.gpuUsedMemory);
				}
				if (hwInfo.gpuUsage !== null) {
					this.gpuUsage = hwInfo.gpuUsage;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuUsage, this.gpuUsage);
				}
				if (hwInfo.memoryUsed !== null) {
					this.ramUsed = hwInfo.memoryUsed.split('GB')[0];
					this.localCacheService.setLocalCacheValue(LocalStorageKey.ramUsed, this.ramUsed);
				}
				if (hwInfo.memoryUsage !== null) {
					this.ramUsage = hwInfo.memoryUsage;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.ramUsage, this.ramUsage);
				}
				if(hwInfo.diskList !== null) {
					this.hds = hwInfo.diskList;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.disksList, this.hds);
				}
			});
		} catch (err) {
			this.logger.error('Widget-SystemMonitor-GetMachineInfo error: ', err.message);
		}
	}

	// hwInfo:
	// {cpuCurrentFrequency: 3.2, gpuCoreCurrentFrequency: 3.2, gpuVramCurrentFrequency: 3.2, cpuUtilization: 31, diskList: Array}
    // cpuCurrentFrequency/gpuCoreCurrentFrequency/gpuVramCurrentFrequency: unit is GHz
	public getDynamicHardwareUsageInfo() {
		try {
			this.hwInfoService.getDynamicHardwareUsageInfo().then( hwInfo => {
				this.logger.info('Widget-SystemMonitor-getDynamicInformationForGpuVram: ', hwInfo);
				if (!hwInfo) { return; }
				if (this.isAvailiableNumber(hwInfo.cpuCurrentFrequency)) {
					this.cpuCurrentFrequency = this.stringForNumber(hwInfo.cpuCurrentFrequency);
					this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuCurrentFrequency, this.cpuCurrentFrequency);

					if (this.hwMachineInfo && this.isAvailiableNumber(this.hwMachineInfo.cpuMaxFrequency)
					&& this.hwMachineInfo.cpuMaxFrequency !== 0) {
						this.cpuUsage = parseFloat((hwInfo.cpuCurrentFrequency / this.hwMachineInfo.cpuMaxFrequency).toFixed(2));
						this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuUsage, this.cpuUsage * 100);
					}
				}
				if (this.isAvailiableNumber(hwInfo.gpuCoreCurrentFrequency)) {
					this.gpuUsedMemory = this.stringForNumber(hwInfo.gpuCoreCurrentFrequency);
					this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuUsedMemory, this.gpuUsedMemory);

					if (this.hwMachineInfo && this.isAvailiableNumber(this.hwMachineInfo.gpuCoreMaxFrequency)
					&& this.hwMachineInfo.gpuCoreMaxFrequency !== 0) {
						this.gpuUsage = parseFloat((100 * hwInfo.gpuCoreCurrentFrequency / this.hwMachineInfo.gpuCoreMaxFrequency).toFixed(2));
						this.localCacheService.setLocalCacheValue(LocalStorageKey.gpuUsage, this.gpuUsage);
					}
				}
				if (this.isAvailiableNumber(hwInfo.gpuVramCurrentFrequency)) {
					this.ramUsed = this.stringForNumber(hwInfo.gpuVramCurrentFrequency);
					this.localCacheService.setLocalCacheValue(LocalStorageKey.ramUsed, this.ramUsed);

					if (this.hwMachineInfo && this.isAvailiableNumber(this.hwMachineInfo.gpuVramMaxFrequency)
					&& this.hwMachineInfo.gpuVramMaxFrequency !== 0) {
						this.ramUsage = parseFloat((100 * hwInfo.gpuVramCurrentFrequency / this.hwMachineInfo.gpuVramMaxFrequency).toFixed(2));
						this.localCacheService.setLocalCacheValue(LocalStorageKey.ramUsage, this.ramUsage);
					}
				}
				if(hwInfo.diskList) {
					this.hds = hwInfo.diskList;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.disksList, this.hds);
				}
				if (this.isAvailiableValue(hwInfo.cpuUtilization)) {
					this.cpuUtilization = hwInfo.cpuUtilization + '%';
					this.localCacheService.setLocalCacheValue(LocalStorageKey.cpuUtilization, this.cpuUtilization);
				}
				this.updateTooltips();
			});
		} catch (err) {
			this.logger.error('Widget-SystemMonitor-GetMachineInfo error: ', err.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Other functions                                                  //
	// 1. Calculate deg for cpu & diss ring                             //
	// 2. Fromate disk size & used size                                 //
	// 3. Show or hide disk list                                        //
	//////////////////////////////////////////////////////////////////////
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

	getHDSize(int) {
		if (int < 1000) {
			return int + 'GB';
		} else {
			const tb = int / 1000;
			return tb.toFixed(2) + 'TB';
		}
	}

	toggleHDs(canClose = false) {
		if (canClose) {
			this.showAllHDs = false;
		} else if (this.hds.length > 2) {
			this.showAllHDs = !this.showAllHDs;
		}
	}

	// #region 3.6
	//////////////////////////////////////////////////////////////////////
	// 1. get over clock state from plugin                              //
	// 2. register oc change event                                      //
	//////////////////////////////////////////////////////////////////////
	private isAvailiableNumber(value) {
		return (value !== null && value !== undefined && !Number.isNaN(parseFloat(value)));
	}

	private isAvailiableValue(value) {
		return (value !== null && value !== undefined && value !== '');
	}

	private stringForNumber(value) {
		if (String(value).indexOf('.') !== -1 && (String(value).length - (String(value).indexOf('.') + 1) >= 2)) {
			return value.toFixed(2);
		}
		return value.toFixed(1);
	}

	private updateUnitOfValue(value) {
		if (value) {
			const unit = value.indexOf('GHz') !== -1 ? 'GHz' : 'GB';
			const numberValue =  (unit && value.indexOf(unit) !== -1) ? value.substr(0, value.indexOf(unit)) : value;
			return this.hwVersionInfo === 1 ? numberValue + 'GHz' : numberValue + 'GB';
		}
		return this.hwVersionInfo === 1 ? '0GHz' : '0GB';
	}

	/**
	 * hwOCInfo.cpuOverClockInfo.isOverClocking: true/false
	 * hwOCInfo.gpuOverClockInfo.isOverClocking: true/false
	 * hwOCInfo.vramOverClockInfo.isOverClocking: true/false
	 */
	getHwOverClockState() {
		try {
			this.gamingOCService.getHwOverClockState().then((response) => {
				if (response) {
					Object.keys(this.hwOCInfo).forEach(
						(key) => {
							if (this.isAvailiableValue(response[this.hwOCInfo[key].featureName])) {
								this.hwOCInfo[key].isOverClocking = this.hwVersionInfo === 1 && response[this.hwOCInfo[key].featureName] && this.hwOCInfo[key].isSupportOCFeature;
							}
						}
					);
				}
			}).catch(() => {});
		} catch(error) {}
	}

	registerOverClockStateChangeEvent() {
		try {
			this.isOCEventBind = true;
			this.shellServices.registerEvent(EventTypes.gamingOCStatusChangeEvent,this.ocStateEvent);
			this.logger.info('system-monitor-registerOverClockStateChangeEvent: register success');
		} catch (error) {
			this.logger.error(
				'system-monitor-registerOverClockStateChangeEvent: register fail; Error message: ',
				error.message
			);
		}
	}

	unRegisterOverClockStateChangeEvent() {
		this.isOCEventBind = false;
		this.shellServices.unRegisterEvent(
			EventTypes.gamingOCStatusChangeEvent,
			this.ocStateEvent
		);
	}

	/**
	 * hwOCInfo.cpuOverClockInfo.isOverClocking: true/false
	 * hwOCInfo.gpuOverClockInfo.isOverClocking: true/false
	 * hwOCInfo.vramOverClockInfo.isOverClocking: true/false
	 */
	onRegisterOverClockStateChangeEvent(response) {
		this.ngZone.run(() => {
			this.logger.info(
				`Widget-system-onRegisterOverClockStateChangeEvent: call back state: ${response}`
			);
			if (response) {
				Object.keys(this.hwOCInfo).forEach(
					(key) => {
						if (this.isAvailiableValue(response[this.hwOCInfo[key].featureName])) {
							this.hwOCInfo[key].isOverClocking = this.hwVersionInfo === 1 && response[this.hwOCInfo[key].featureName] && this.hwOCInfo[key].isSupportOCFeature;
						}
					}
				);
				if (this.hwVersionInfo === 1) {
					this.getHardwareInformation();
					this.cpuInfo.isOverClocking = this.hwOCInfo.cpuOverClockInfo.isOverClocking;
					this.gpuInfo.isOverClocking = this.hwOCInfo.gpuOverClockInfo.isOverClocking;
					this.vramInfo.isOverClocking = this.hwOCInfo.vramOverClockInfo.isOverClocking;
				}
			}
		});
	}

	updateTooltips() {
		if (this.hwVersionInfo === 1) {
			this.cpuInfo.modal = this.cpuModuleName;
			this.cpuInfo.frequency = this.cpuCurrentFrequency + ' / ' + this.cpuBaseFrequency;
			this.cpuInfo.usage = this.cpuUtilization;
			this.gpuInfo.modal = this.gpuModuleName;
			this.gpuInfo.frequency = this.gpuUsedMemory + ' / ' + this.gpuMemorySize;
			this.vramInfo.modal = this.ramModuleName;
			this.vramInfo.frequency = this.ramUsed + ' / ' + this.ramSize;
		}
	}
	//#endregion
}
