import { NetworkBoostStatus } from './../../../data-models/gaming/networkboost-status.model';
import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { Component, OnInit, NgZone } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RamOCSatus } from 'src/app/data-models/gaming/ram-overclock-status.model';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { HybridModeStatus } from 'src/app/data-models/gaming/hybrid-mode-status.model';
import { TouchpadLockStatus } from 'src/app/data-models/gaming/touchpad-lock-status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingKeyLockService } from 'src/app/services/gaming/gaming-keylock/gaming-key-lock.service';
import { GamingHybridModeService } from 'src/app/services/gaming/gaming-hybrid-mode/gaming-hybrid-mode.service';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { Gaming } from 'src/app/enums/gaming.enum';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { Router } from '@angular/router';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { ModalGamingThermalMode2Component } from '../../modal/modal-gaming-thermal-mode2/modal-gaming-thermal-mode2.component';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { GamingOverDriveService } from 'src/app/services/gaming/gaming-over-drive/gaming-over-drive.service';

@Component({
	selector: 'vtr-widget-legion-edge',
	templateUrl: './widget-legion-edge.component.html',
	styleUrls: ['./widget-legion-edge.component.scss']
})
export class WidgetLegionEdgeComponent implements OnInit {
	public RamOCSatusObj = new RamOCSatus();
	public hybrimodeStatus = false;
	public HybrimodeStatusObj = new HybridModeStatus();
	public networkboostStatus = false;
	public NetworkBoostStatusObj = new NetworkBoostStatus();
	public autoCloseStatusObj = new AutoCloseStatus();
	public touchpadLockStatus: any;
	public TouchpadLockStatusObj = new TouchpadLockStatus();
	public gamingCapabilities: GamingAllCapabilities = new GamingAllCapabilities();
	public disableButtons = false;
	public legionUpdate = [
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.title',
			name: 'gaming.dashboard.device.legionEdge.title',
			subHeader: '',
			isVisible: false,
			isCustomizable: false,
			isCollapsible: true,
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isPopup: false,
			driverPopupText: 'gaming.dashboard.device.legionEdge.driverPopup.cpuOverclockText',
			isDriverPopup: false,
			isChecked: false,
			tooltipText: '',
			id: 'legionedge cpuoverlock', // don't change it has dependency.
			ariaLabel: 'cpu overlock',
			type: 'gaming.dashboard.device.legionEdge.title'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.ramOverlock',
			name: 'gaming.dashboard.device.legionEdge.ramOverlock',
			subHeader: '',
			isVisible: false,
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isDriverPopup: false,
			isChecked: false,
			tooltipText: '',
			readonly: true,
			id: 'legionedge ramoverlock',
			ariaLabel: 'ram overlock',
			type: 'gaming.dashboard.device.legionEdge.ramOverlock',
			settings: ''
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.networkBoost',
			name: 'gaming.dashboard.device.legionEdge.networkBoost',
			subHeader: '',
			isVisible: false,
			isCustomizable: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isDriverPopup: false,
			driverPopupText: 'gaming.dashboard.device.legionEdge.driverPopup.networkBoostText',
			isChecked: false,
			tooltipText: '',
			readonly: true,
			id: 'legionedge networkboost', // don't change, it has dependency.
			ariaLabel: 'network boost',
			type: 'gaming.dashboard.device.legionEdge.networkBoost',
			routerLink: '/networkboost',
			canNavigate: true,
			settings: 'legion_edge_networkboost_gear',
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.autoClose',
			name: 'gaming.dashboard.device.legionEdge.autoClose',
			subHeader: '',
			isVisible: false,
			isCustomizable: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isDriverPopup: false,
			isChecked: false,
			tooltipText: '',
			id: 'legionedge autoclose',
			ariaLabel: 'auto close',
			type: 'gaming.dashboard.device.legionEdge.autoClose',
			routerLink: '/autoclose',
			canNavigate: true,
			settings: 'legion_edge_autoclose_gear'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.hybridMode',
			name: 'gaming.dashboard.device.legionEdge.hybridMode',
			subHeader: '',
			isVisible: false,
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isDriverPopup: false,
			driverPopupText: 'gaming.dashboard.device.legionEdge.driverPopup.hybridModeText',
			isChecked: false,
			tooltipText: '',
			readonly: true,
			id: 'legionedge hybridmode',
			ariaLabel: 'hybrid mode',
			descriptionLabel: 'hybrid mode window opened',
			type: 'gaming.dashboard.device.legionEdge.hybridMode',
			settings: ''
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.overDrive',
			name: 'gaming.dashboard.device.legionEdge.overDrive',
			subHeader: '',
			isVisible: false,
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isDriverPopup: false,
			isChecked: true,
			tooltipText: '',
			id: 'legionedge overDrive',
			ariaLabel: 'over drive',
			type: 'gaming.dashboard.device.legionEdge.overDrive',
			settings: ''
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.touchpadLock',
			name: 'gaming.dashboard.device.legionEdge.touchpadLock',
			subHeader: '',
			isVisible: false,
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isDriverPopup: false,
			isChecked: true,
			tooltipText: '',
			id: 'legionedge touchpadlock',
			ariaLabel: 'touchpadlock',
			type: 'gaming.dashboard.device.legionEdge.touchpadLock',
			descriptionLabel: 'Touchpad lock window opened',
			settings: ''
		}
	];

	public drop = {
		curSelected: 1,
		modeType: 1,
		hideDropDown: false,
		dropOptions: [
			{
				header: 'gaming.dashboard.device.legionEdge.status.alwayson',
				name: 'gaming.dashboard.device.legionEdge.status.alwayson',
				description: 'gaming.dashboard.device.legionEdge.statusText.onText',
				id: 'cpu overclock on',
				ariaLabel: 'on',
				metricitem: 'cpu_overclock_on',
				value: 1
			},
			{
				header: 'gaming.dashboard.device.legionEdge.status.whenGaming',
				name: 'gaming.dashboard.device.legionEdge.status.whenGaming',
				description: 'gaming.dashboard.device.legionEdge.statusText.gamingText',
				id: 'cpu overclock when gaming',
				ariaLabel: 'when gaming',
				metricitem: 'cpu_overclock_when_gaming',
				value: 2
			},
			{
				header: 'gaming.dashboard.device.legionEdge.status.off',
				name: 'gaming.dashboard.device.legionEdge.status.off',
				description: 'gaming.dashboard.device.legionEdge.statusText.offText',
				id: 'cpu overclock off',
				ariaLabel: 'off',
				metricitem: 'cpu_overclock_off',
				value: 3
			}
		]
	};

	public cpuOCStatus: CPUOCStatus = new CPUOCStatus();
	public setCpuOCStatus: any;
	public cacheMemOCFeature = false;
	public cacheHybridModeFeature = false;
	public cacheAutoCloseFeature = false;
	// Version 3.2: thermal mode 2.0 & performance OC
	public thermalModeRealStatus = 2;
	public OCSettings = 3;
	// use enum instead of hard code on 200319 by Guo Jing
	public legionItemIndex = {
		cpuOverclock: 0,
		ramOverlock: 1,
		networkBoost: 2,
		autoClose:3,
		hybridMode: 4,
		overDrive: 5,
		touchpadLock: 6
	};

	constructor(
		private modalService: NgbModal,
		private ngZone: NgZone,
		private shellServices: VantageShellService,
		private gamingSystemUpdateService: GamingSystemUpdateService,
		private gamingAllCapabilities: GamingAllCapabilitiesService,
		private commonService: CommonService,
		private gamingKeyLockService: GamingKeyLockService,
		private gamingHybridModeService: GamingHybridModeService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private gamingNetworkBoostService: NetworkBoostService,
		private gamingAutoCloseService: GamingAutoCloseService,
		private gamingThermalModeService: GamingThermalModeService,
		private gamingOCService: GamingOCService,
		private gamingOverDriveService: GamingOverDriveService,
		private router: Router,
		private logger: LoggerService
	) { }
	ngOnInit() {
		this.gamingCapabilities.hybridModeFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.hybridModeFeature
		);
		this.gamingCapabilities.cpuOCFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.cpuOCFeature
		);
		this.gamingCapabilities.memOCFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.memOCFeature
		);
		this.gamingCapabilities.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.optimizationFeature
		);
		this.gamingCapabilities.networkBoostFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.networkBoostFeature
		);
		this.gamingCapabilities.touchpadLockFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.touchpadLockFeature
		);
		this.gamingCapabilities.touchpadLockStatus = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.TouchpadLockStatus
		);
		this.gamingCapabilities.winKeyLockFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.winKeyLockFeature
		);
		this.gamingCapabilities.xtuService = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.xtuService
		);
		this.gamingCapabilities.fbnetFilter = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.fbNetFilter
		);

		// Version 3.2: Lite Gaming
		this.gamingCapabilities.desktopType = this.commonService.getLocalStorageValue(LocalStorageKey.desktopType);
		this.gamingCapabilities.liteGaming = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.liteGaming);
		// Version 3.2: Thermal Mode 2.0 capability
		this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.smartFanFeature
		);
		this.gamingCapabilities.thermalModeVersion = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.thermalModeVersion
		);
		// Version 3.2: OC capabilities for performanceOC(Thermal Mode 2.0)
		this.gamingCapabilities.gpuOCFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.gpuOCFeature
		);
		this.gamingCapabilities.nvDriver = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.nvDriver
		);
		// Version 3.3: over drive capability
		this.gamingCapabilities.overDriveFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.overDriveFeature
		)
		// Version 3.2: init Thermal Mode 2.0 status for cache 
		if (this.gamingCapabilities.smartFanFeature) {
			if (this.gamingCapabilities.thermalModeVersion === 2) {
				const thermalModeRealStatusCache = this.commonService.getLocalStorageValue(LocalStorageKey.RealThermalModeStatus);
				if (thermalModeRealStatusCache !== undefined) {
					this.thermalModeRealStatus = thermalModeRealStatusCache;
				}
				if (this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.xtuService && this.gamingCapabilities.nvDriver) {
						if (this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) === 1 && this.commonService.getLocalStorageValue(LocalStorageKey.GpuOCStatus) === 1) {
							this.OCSettings = 1;
						} else {
							this.OCSettings = 3;
						}
					}
				} else if (this.gamingCapabilities.cpuOCFeature && !this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.xtuService) {
						this.OCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus);
					}
				} else if (!this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.nvDriver) {
						this.OCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.GpuOCStatus);
					}
				}
			}
		}
		this.cacheMemOCFeature = this.commonService.getLocalStorageValue(LocalStorageKey.memOCFeatureStatus);
		this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked = this.cacheMemOCFeature;

		this.cacheHybridModeFeature = this.commonService.getLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus);
		this.legionUpdate[this.legionItemIndex.hybridMode].isChecked = this.cacheHybridModeFeature;

		this.cacheAutoCloseFeature = this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus);
		this.legionUpdate[this.legionItemIndex.autoClose].isChecked = this.cacheAutoCloseFeature;
		this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = this.getNetworkBoostCacheStatus();
		// Version 3.3: init over drive status from cache
		this.legionUpdate[this.legionItemIndex.overDrive].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.overDriveStatus);
		// Initialize Legion Edge component from cache
		this.legionEdgeInit();
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.gamingCapabilities = response.payload;
				this.unRegisterThermalModeRealStatusChangeEvent();
				this.legionEdgeInit();
			}
		});
	}

	ngOnDestroy(): void {
		this.unRegisterThermalModeRealStatusChangeEvent();
	}

	legionEdgeInit() {
		const gamingStatus = this.gamingCapabilities;
		// Version 3.2: thermalMode 2.0
		if (gamingStatus.thermalModeVersion === 2) {
			this.legionUpdate[this.legionItemIndex.cpuOverclock].isVisible = false;
		} else {
			this.legionUpdate[this.legionItemIndex.cpuOverclock].isVisible = gamingStatus.cpuOCFeature;
		}
		this.legionUpdate[this.legionItemIndex.ramOverlock].isVisible = gamingStatus.memOCFeature;
		this.legionUpdate[this.legionItemIndex.networkBoost].isVisible = gamingStatus.networkBoostFeature || false;
		this.legionUpdate[this.legionItemIndex.autoClose].isVisible = gamingStatus.optimizationFeature || false;
		this.legionUpdate[this.legionItemIndex.hybridMode].isVisible = gamingStatus.hybridModeFeature;
		this.legionUpdate[this.legionItemIndex.overDrive].isVisible = gamingStatus.overDriveFeature;
		this.legionUpdate[this.legionItemIndex.touchpadLock].isVisible = gamingStatus.touchpadLockFeature;
		this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = gamingStatus.touchpadLockStatus;
		if (gamingStatus.fbnetFilter) {
			this.legionUpdate[this.legionItemIndex.networkBoost].readonly = false;
		} else {
			this.legionUpdate[this.legionItemIndex.networkBoost].readonly = true;
		}
		if (!gamingStatus.xtuService) {
			this.drop.hideDropDown = true;
		} else {
			this.drop.hideDropDown = false;
		}
		// Version 3.2: Thermal Mode 2
		if (gamingStatus.smartFanFeature && gamingStatus.thermalModeVersion === 2) {
			this.renderThermalMode2RealStatus();
			this.registerThermalModeRealStatusChangeEvent();
			if (gamingStatus.cpuOCFeature || gamingStatus.gpuOCFeature) {
				this.renderThermalMode2OCSettings();
			}
		}
		if (gamingStatus.cpuOCFeature && gamingStatus.thermalModeVersion === 1) {
			this.renderCPUOverClockStatus();
		}
		if (gamingStatus.memOCFeature) {
			this.renderRamOverClockStatus();
		}

		if (gamingStatus.touchpadLockFeature && gamingStatus.winKeyLockFeature) {
			this.renderTouchpadLockStatus();
		}

		if (gamingStatus.hybridModeFeature) {
			this.renderHybridModeStatus();
		}

		if (gamingStatus.optimizationFeature) {
			this.renderAutoCloseStatus();
		}

		if (gamingStatus.networkBoostFeature) {
			// this.legionUpdate[2].readonly = false;
			this.renderNetworkBoostStatus();
		}
		// Version 3.3: inti overdrive status
		if(gamingStatus.overDriveFeature) {
			try {
				this.gamingOverDriveService.getOverDriveStatus().then( res => {
					this.logger.info(`Widget-LegionEdge-intiOverDriveStatus: get value from ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked} to ${res}`);
					if( res !== this.legionUpdate[this.legionItemIndex.overDrive] && res !== undefined) {
						this.legionUpdate[this.legionItemIndex.overDrive].isChecked = res;
						this.commonService.setLocalStorageValue(LocalStorageKey.overDriveStatus, res)
					}
				});
			} catch(error) {
				this.logger.error('Widget-LegionEdge-intiOverDriveStatus: get fail; Error message: ', error.message);
				throw new Error(error.message);
			}
		}
	}

	public renderAutoCloseStatus() {
		this.gamingAutoCloseService.getAutoCloseStatus().then((autoCloseModeStatus) => {
			if (autoCloseModeStatus !== undefined) {
				this.autoCloseStatusObj.autoCloseStatus = autoCloseModeStatus;
				this.setAutoCloseCacheStatus(autoCloseModeStatus);
				this.legionUpdate[this.legionItemIndex.autoClose].isChecked = autoCloseModeStatus;
			}
		});
	}

	public renderNetworkBoostStatus() {
		this.gamingNetworkBoostService.getNetworkBoostStatus().then((networkBoostModeStatus) => {
			if (networkBoostModeStatus !== undefined) {
				this.NetworkBoostStatusObj.networkBoostStatus = networkBoostModeStatus;
				this.setNetworkBoostCacheStatus(networkBoostModeStatus);
				this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = networkBoostModeStatus;
				if (!networkBoostModeStatus) {
					if (this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup) === 2) {
						this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup, 1);
					}
				}
			}
		});
	}

	public async setAutoCloseStatus(status: any) {
		try {
			const isStatusUpdated = await this.gamingAutoCloseService.setAutoCloseStatus(status);
			if (isStatusUpdated) {
				this.setAutoCloseCacheStatus(status);
			}
		} catch (err) { }
	}

	public async setNetworkBoostStatus(status: any) {
		try {
			const isStatusUpdated = await this.gamingNetworkBoostService.setNetworkBoostStatus(status);
			if (isStatusUpdated) {
				this.setNetworkBoostCacheStatus(status);
				this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = status;
			} else {
				this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = !status;
			}
		} catch (err) { }
	}

	public getAutoCloseCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus);
	}

	public setAutoCloseCacheStatus(autoCloseStatus: boolean) {
		return this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseStatus, autoCloseStatus);
	}

	public getNetworkBoostCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoostStatus, false);
	}

	public setNetworkBoostCacheStatus(networkBoostStatus: boolean) {
		return this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, networkBoostStatus);
	}

	public GetCPUOverClockCacheStatus(): any {
		const status =
			this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) || this.cpuOCStatus.cpuOCStatus;
		return status;
	}
	public renderCPUOverClockStatus() {
		try {
			this.drop.curSelected = this.GetCPUOverClockCacheStatus();
			this.gamingSystemUpdateService.getCpuOCStatus().then((cpuOCStatus) => {
				if (cpuOCStatus !== undefined) {
					const CpuOCStatusObj = new CPUOCStatus();
					CpuOCStatusObj.cpuOCStatus = cpuOCStatus;
					if (cpuOCStatus !== this.drop.curSelected) {
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, cpuOCStatus);
					}
					this.drop.curSelected = CpuOCStatusObj.cpuOCStatus;
				}
			});
		} catch (error) { }
	}
	// Version 3.2: real status of thermal mode 2 
	public renderThermalMode2RealStatus() {
		try {
			this.gamingThermalModeService.getThermalModeRealStatus().then(res => {
				this.logger.info(`Widget-LegionEdge-RenderThermalMode2RealStatus: get value from ${ this.thermalModeRealStatus } to ${ res }`);
				if (res !== this.thermalModeRealStatus && res !== undefined) {
					this.thermalModeRealStatus = res;
					this.commonService.setLocalStorageValue(LocalStorageKey.RealThermalModeStatus, this.thermalModeRealStatus);
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-RenderThermalMode2RealStatus: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}

	}

	public registerThermalModeRealStatusChangeEvent() {
		if (this.gamingCapabilities.smartFanFeature) {
			try {
				this.gamingThermalModeService.regThermalModeRealStatusChangeEvent();
				this.shellServices.registerEvent(
					EventTypes.gamingThermalModeRealStatusChangeEvent,
					this.onRegThermalModeRealStatusChangeEvent.bind(this)
				);
				this.logger.info('Widget-LegionEdge-RegisterThermalModeRealStatusChangeEvent: register success');
			} catch (error) {
				this.logger.error('Widget-LegionEdge-RegisterThermalModeRealStatusChangeEvent: register fail; Error message: ', error.message);
				throw new Error(error.message);
			}

		}
	}

	public unRegisterThermalModeRealStatusChangeEvent() {
		this.shellServices.unRegisterEvent(
			EventTypes.gamingThermalModeRealStatusChangeEvent,
			this.onRegThermalModeRealStatusChangeEvent.bind(this)
		);
	}

	public onRegThermalModeRealStatusChangeEvent(currentRealStatus: any) {
		this.ngZone.run(() => {
			this.logger.info(`Widget-LegionEdge-OnRegThermalModeRealStatusChangeEvent: call back from ${ this.thermalModeRealStatus } to ${ currentRealStatus }`);
			if (currentRealStatus !== undefined && this.thermalModeRealStatus !== currentRealStatus) {
				this.thermalModeRealStatus = currentRealStatus;
				this.commonService.setLocalStorageValue(LocalStorageKey.RealThermalModeStatus, this.thermalModeRealStatus);
			}
		});
	}
	// Version 3.2: performanceOC
	public renderThermalMode2OCSettings() {
		try {
			this.gamingOCService.getPerformanceOCSetting().then(res => {
				this.logger.info(`Widget-LegionEdge-RenderThermalMode2OCSettings: get value from ${ this.OCSettings } to ${ res }`);
				if (this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.xtuService && this.gamingCapabilities.nvDriver) {
						this.OCSettings = res ? 1 : 3;
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.OCSettings);
						this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, this.OCSettings);
					} else {
						this.OCSettings = 3;
					}
				} else if (this.gamingCapabilities.cpuOCFeature && !this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.xtuService) {
						this.OCSettings = res ? 1 : 3;
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.OCSettings);
					} else {
						this.OCSettings = 3;
					}
				} else if (!this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.nvDriver) {
						this.OCSettings = res ? 1 : 3;
						this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, this.OCSettings);
					} else {
						this.OCSettings = 3;
					}
				} else {
					this.OCSettings = 3;
				}
			});
		} catch (error) {
			this.OCSettings = 3;
			this.logger.error('Widget-LegionEdge-RenderThermalMode2OCSettings: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	onOptionSelected(event: any) {
		if (event.target.name === 'gaming.dashboard.device.legionEdge.title') {
			if (this.setCpuOCStatus === undefined) {
				this.setCpuOCStatus = new CPUOCStatus();
			}
			this.setCpuOCStatus.cpuOCStatus = event.option.value;
			this.gamingSystemUpdateService
				.setCpuOCStatus(this.setCpuOCStatus.cpuOCStatus)
				.then((value: boolean) => {
					if (!value) {
						this.drop.curSelected = this.GetCPUOverClockCacheStatus();
					} else {
						this.drop.curSelected = this.setCpuOCStatus.cpuOCStatus;
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.drop.curSelected);
					}
				})
				.catch((error) => { });
		}
	}
	openModal() {
		this.modalService.open(ModalGamingLegionedgeComponent, { backdrop: true, windowClass: 'gaming-help-modal' });
	}
	openThermalMode2Modal() {
		const modalRef = this.modalService.open(ModalGamingThermalMode2Component, { backdrop: 'static', windowClass: 'modal-fun' });
		modalRef.componentInstance.OCSettingsMsg.subscribe(res => {
			this.OCSettings = res;
		});
	}
	public renderRamOverClockStatus() {
		if (this.gamingCapabilities.xtuService === true) {
			this.gamingSystemUpdateService.getRamOCStatus().then((ramOcStatus) => {
				if (ramOcStatus !== undefined) {
					this.RamOCSatusObj.ramOcStatus = ramOcStatus;

					this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked = ramOcStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.memOCFeatureStatus, ramOcStatus);
				}
			});
		}
	}

	public renderHybridModeStatus() {
		this.gamingHybridModeService.getHybridModeStatus().then((hybridModeStatus) => {
			if (hybridModeStatus !== undefined) {
				this.HybrimodeStatusObj.hybridModeStatus = hybridModeStatus;
				this.legionUpdate[this.legionItemIndex.hybridMode].isChecked = hybridModeStatus;
				this.commonService.setLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus, hybridModeStatus);
			}
		});
	}
	public renderTouchpadLockStatus() {
		// value from cache
		if (this.commonService !== undefined) {
			this.touchpadLockStatus = this.GetTouchpadLockCacheStatus();
			if (this.touchpadLockStatus !== undefined) {
				this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = this.touchpadLockStatus;
			} else {
				// set default value from model property
				this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = this.TouchpadLockStatusObj.touchpadLockStatus;
				this.SetTouchpadLockCacheStatus(this.TouchpadLockStatusObj.touchpadLockStatus);
			}
		}
		// value from js bridge
		this.gamingKeyLockService.getKeyLockStatus().then((touchpadLockStatus) => {
			if (touchpadLockStatus !== undefined) {
				this.TouchpadLockStatusObj.touchpadLockStatus = touchpadLockStatus;
				this.SetTouchpadLockCacheStatus(touchpadLockStatus);
				this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = touchpadLockStatus;
			}
		});
	}

	public GetTouchpadLockCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.TouchpadLockStatus);
	}

	public SetTouchpadLockCacheStatus(touchpadLockStatus: boolean) {
		return this.commonService.setLocalStorageValue(LocalStorageKey.TouchpadLockStatus, touchpadLockStatus);
	}

	public closeLegionEdgePopups() {
		Object.entries(this.legionUpdate).forEach(([key]) => {
			this.legionUpdate[key].isDriverPopup = false;
			this.legionUpdate[key].isPopup = false;
		});
	}

	public onPopupClosed($event) {
		const name = $event.name;
		if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			this.legionUpdate[this.legionItemIndex.ramOverlock].isDriverPopup = false;
			this.legionUpdate[this.legionItemIndex.ramOverlock].isPopup = false;
			this.commonService.sendNotification(name, this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked);
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.legionUpdate[this.legionItemIndex.hybridMode].isPopup = false;
			this.commonService.sendNotification(name, this.legionUpdate[this.legionItemIndex.hybridMode].isChecked);
		}
		if (name === 'gaming.dashboard.device.legionEdge.title') {
			this.legionUpdate[this.legionItemIndex.cpuOverclock].isDriverPopup = false;
			this.legionUpdate[this.legionItemIndex.cpuOverclock].isPopup = false;
		}
		if (name === 'gaming.dashboard.device.legionEdge.networkBoost') {
			this.legionUpdate[this.legionItemIndex.networkBoost].isDriverPopup = false;
			this.legionUpdate[this.legionItemIndex.networkBoost].isPopup = false;
		}
	}

	public async toggleOnOffRamOCStatus($event) {
		const { name, checked } = $event.target;
		let status = $event.target.value;
		status = status === 'false' ? false : status;
		status = status === 'true' ? true : status;
		this.closeLegionEdgePopups();
		if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			if (this.gamingCapabilities.xtuService === false) {
				this.legionUpdate[this.legionItemIndex.ramOverlock].isDriverPopup = true;
			} else {
				this.legionUpdate[this.legionItemIndex.ramOverlock].isPopup = true;
			}
			this.gamingSystemUpdateService
				.setRamOCStatus(!status)
				.then((value: boolean) => { })
				.catch((error) => { });
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.legionUpdate[this.legionItemIndex.hybridMode].isPopup = true;
			this.gamingHybridModeService
				.setHybridModeStatus(!status)
				.then((value: boolean) => { })
				.catch((error) => { });
		}
		if (name === 'gaming.dashboard.device.legionEdge.touchpadLock') {
			this.TouchpadLockStatusObj.touchpadLockStatus = status;
			this.gamingKeyLockService
				.setKeyLockStatus(status)
				.then((value: boolean) => {
					if (value) {
						this.SetTouchpadLockCacheStatus(status);
					} else {
						this.TouchpadLockStatusObj.touchpadLockStatus = !status;
					}
				})
				.catch((error) => { });
		}

		if (name === 'gaming.dashboard.device.legionEdge.autoClose') {
			await this.setAutoCloseStatus(status);
		}

		if (name === 'gaming.dashboard.device.legionEdge.networkBoost') {
			this.gamingCapabilities.fbnetFilter = !!this.gamingCapabilities.fbnetFilter;
			if (!this.gamingCapabilities.fbnetFilter) {
				this.legionUpdate[this.legionItemIndex.networkBoost].isDriverPopup = true;
			} else {
				await this.setNetworkBoostStatus(status);
			}
		}
		// Version 3.3: set over drive status by toggle
		if (name === 'gaming.dashboard.device.legionEdge.overDrive') {
			try {
				this.gamingOverDriveService.setOverDriveStatus(status).then( res => {
					if(res) {
						this.logger.info(`Widget-LegionEdge-toggleOnOffRamOCStatus: set overDrive return value: ${res}, overDrive status from ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked} to ${status}`);
						this.legionUpdate[this.legionItemIndex.overDrive].isChecked = status;
						this.commonService.setLocalStorageValue(LocalStorageKey.overDriveStatus, status);
					} else {
						this.legionUpdate[this.legionItemIndex.overDrive].isChecked = !status;
						this.logger.error(`Widget-LegionEdge-toggleOnOffRamOCStatus: set overDrive return false, overDrive status keep ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked}`);
					}
				});
			} catch(error) {
				this.legionUpdate[this.legionItemIndex.overDrive].isChecked = !status;
				this.logger.error('Widget-LegionEdge-toggleOnOffRamOCStatus: set overDrive fail, error message: ', error.message);
				throw new Error(error.message);
			}
		}
	}

	onIconClick(event: any) {
		event = event || { name: '' };
		const { name } = event;
		this.closeLegionEdgePopups();
		if (name === 'gaming.dashboard.device.legionEdge.networkBoost') {
			this.gamingCapabilities.fbnetFilter = !!this.gamingCapabilities.fbnetFilter;
			if (!this.gamingCapabilities.fbnetFilter) {
				this.legionUpdate[this.legionItemIndex.networkBoost].isDriverPopup = true;
			} else {
				this.router.navigate(['/gaming/networkboost']);
			}
		}
		if (name === 'gaming.dashboard.device.legionEdge.autoClose') {
			this.router.navigate(['/gaming/autoclose']);
		}
	}

	onShowDropdown(event) {
		if (event.type === 'gaming.dashboard.device.legionEdge.title') {
			if (this.drop.hideDropDown) {
				this.closeLegionEdgePopups();
				this.legionUpdate[this.legionItemIndex.cpuOverclock].isDriverPopup = true;
			}
		}
	}
}
