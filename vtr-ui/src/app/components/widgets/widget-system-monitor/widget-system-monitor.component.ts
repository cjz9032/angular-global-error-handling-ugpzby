import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import SystemStatus from 'src/app/data-models/gaming/system-status.model';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
// import { Subscription } from 'rxjs/internal/Subscription';
// import { CommonService } from 'src/app/services/common/common.service';
// import { Gaming } from 'src/app/enums/gaming.enum';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';

@Component({
	selector: 'vtr-widget-system-monitor',
	templateUrl: './widget-system-monitor.component.html',
	styleUrls: ['./widget-system-monitor.component.scss'],
})
export class WidgetSystemMonitorComponent implements OnInit, OnDestroy {
	public ver = 0;
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
	public cpuInfo: any;
	public gpuInfo: any;
	public ramInfo: any;
	public hwNewVersionInfo = false;
	public hwOverClockInfo = JSON.parse(JSON.stringify(SystemStatus.hwOverClockInfo));
	public ocStateEvent: any;
	// private notifcationSubscription: Subscription;
	private isOCEventBind = false;

	constructor(
		private hwInfoService: HwInfoService,
		private localCacheService: LocalCacheService,
		private logger: LoggerService,
		private shellServices: VantageShellService,
		// private commonService: CommonService,
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
		this.gpuMemorySize = this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuMemorySize, '8GB');
		this.gpuUsage = this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuUsage, 0);
		this.ramModuleName = this.localCacheService.getLocalCacheValue(LocalStorageKey.ramModuleName, 'N/A');
		this.ramUsed = this.localCacheService.getLocalCacheValue(LocalStorageKey.ramUsed, 0);
		this.ramSize = this.localCacheService.getLocalCacheValue(LocalStorageKey.ramSize, '16GB');
		this.ramUsage = this.localCacheService.getLocalCacheValue(LocalStorageKey.ramUsage, 0);
		this.hds = this.localCacheService.getLocalCacheValue(LocalStorageKey.disksList, this.hds);

		//////////////////////////////////////////////////////////////////////
		// Get machine info from JSBridge                                   //
		// Feature 0: Get CPU & GPU & Ram info                              //
		// Feature 1: GPU module name, memory size & used, usage            //
		// Feature 2: RAM module name, memory size & used, usage            //
		//////////////////////////////////////////////////////////////////////
		this.getMachineInfo();
		this.getRealTimeUsageInfo();
		this.loop = setInterval(() => {
			this.getRealTimeUsageInfo();
		}, 5000);
	}

	ngOnDestroy() {
		clearInterval(this.loop);
		this.loop = null;
	}

	//////////////////////////////////////////////////////////////////////
	// Get Machine Info                                                 //
	// 1. CPU module name, base frequence                               //
	// 2. GPU module name, memory size                                  //
	// 3. RAM module name, memory size                                  //
	//////////////////////////////////////////////////////////////////////
	public getMachineInfo() {
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

	//////////////////////////////////////////////////////////////////////
	// Get real time Info & set local cache                             //
	// 1. CPU current frequence & usage                                 //
	// 2. GPU used memory & usage                                       //
	// 3. RAM used memory & usage                                       //
	// 4. Disk list(name, type, isSystemDisk, capacity, used, usage)    //
	//////////////////////////////////////////////////////////////////////
	public getRealTimeUsageInfo() {
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

				// TODO version 3.6 new tips
				// if (this.cpuModuleName === 'x60') {
				// 	this.ver = 1;
				// }
				// this.cpuInfo = {
				// 	isOverClocking: true,
				// 	modal: this.cpuModuleName,
				// 	frequency: '2.4/4.3Ghz',
				// 	usage: '63%',
				// };
				// this.gpuInfo = {
				// 	isOverClocking: true,
				// 	modal: this.gpuModuleName,
				// 	frequency: '2.4/4.3Ghz',
				// 	usage: '',
				// };
				// this.ramInfo = {
				// 	isOverClocking: false,
				// 	modal: this.memoryModuleName,
				// 	frequency: '2.4/4.3Ghz',
				// 	usage: '',
				// };
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

	getHwOverClockState() {
		this.hwInfoService.getHwOverClockState().then((response) => {
			if (response) {
				Object.keys(this.hwOverClockInfo).forEach(
					(key) => {
						if (response[key]) {
							this.hwOverClockInfo[key].isOverClocking = response[key];
						}
					}
				);
			}
		}).catch(() => {});
	}

	registerOverClockStateChangeEvent() {
		try {
			this.isOCEventBind = true;
			this.gamingOCService.regOCRealStatusChangeEvent();
			this.shellServices.registerEvent(
			EventTypes.gamingOCStatusChangeEvent,
				this.ocStateEvent
			);
			this.logger.info('system-monitor-registerOverClockStateChangeEvent: register success');
		} catch (error) {
			this.logger.error(
				'system-monitor-registerOverClockStateChangeEvent: register fail; Error message: ',
				error.message
			);
		}
	}

	unRegisterOverClockStateChangeEvent() {
		this.shellServices.unRegisterEvent(
			EventTypes.gamingOCStatusChangeEvent,
			this.ocStateEvent
		);
		this.isOCEventBind = false;
	}

	onRegisterOverClockStateChangeEvent(state) {
		this.ngZone.run(() => {
			this.logger.info(
				`Widget-system-onRegisterOverClockStateChangeEvent: call back state: ${state}`
			);
			if (state) {
				this.hwOverClockInfo.cpuOverClockInfo.isOverClocking = state.cpuOCState;
				this.hwOverClockInfo.gpuOverClockInfo.isOverClocking = state.gpuOCState;
				this.hwOverClockInfo.vramOverClockInfo.isOverClocking = state.vramOCState;

				if (this.hwNewVersionInfo) {
					// this.getMachineInfoForGpuVram();
				}
			}
		});
	}
}
