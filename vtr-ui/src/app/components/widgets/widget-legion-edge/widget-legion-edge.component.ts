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
import { GamingThermal2 } from 'src/app/enums/gaming-thermal2.enum';

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
	public thermalMode2Enum = GamingThermal2;
	public thermalModeRealStatus = this.thermalMode2Enum.balance;
	thermalModeEvent: any;
	public performanceOCSettings = false;
	// use enum instead of hard code on 200319 by Guo Jing
	public legionItemIndex = {
		cpuOverclock: 0,
		ramOverlock: 1,
		networkBoost: 2,
		autoClose: 3,
		hybridMode: 4,
		overDrive: 5,
		touchpadLock: 6
	};

	constructor(
		private modalService: NgbModal,
		private ngZone: NgZone,
		private shellServices: VantageShellService,
		private gamingSystemUpdateService: GamingSystemUpdateService,
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
		// Get capabilities from cache                           
		// Feature 0: machine type
		// Version 3.2
		this.gamingCapabilities.desktopType = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.desktopType);
		this.gamingCapabilities.liteGaming = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.liteGaming);

		// Feature 1: thermal mode 2.0 and performanceOC
		// Version 3.2
		this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.smartFanFeature);
		this.gamingCapabilities.thermalModeVersion = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.thermalModeVersion);
		this.gamingCapabilities.gpuOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.gpuOCFeature);
		this.gamingCapabilities.nvDriver = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.nvDriver);

		// Feature 2: CPU Over clock
		this.gamingCapabilities.cpuOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.cpuOCFeature);
		this.gamingCapabilities.xtuService = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.xtuService);

		// Feature 3: memory Over clock
		this.gamingCapabilities.memOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.memOCFeature);

		// Feature 4: network boost
		this.gamingCapabilities.networkBoostFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.networkBoostFeature);
		this.gamingCapabilities.fbnetFilter = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.fbNetFilter);

		// Feature 5: auto close
		this.gamingCapabilities.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.optimizationFeature);

		// Feature 6: hybrid mode
		this.gamingCapabilities.hybridModeFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.hybridModeFeature);

		// Feature 7: over drive
		this.gamingCapabilities.overDriveFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.overDriveFeature);

		// Feature 8: touchpad lock
		this.gamingCapabilities.touchpadLockFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.touchpadLockFeature);
		this.gamingCapabilities.touchpadLockStatus = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.TouchpadLockStatus);
		this.gamingCapabilities.winKeyLockFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.winKeyLockFeature);

		//////////////////////////////////////////////////////////////////////
		// Get status from cache
		// Feature 1: thermal mode real status & performanceOC status
		// Version 3.2
		if (this.gamingCapabilities.smartFanFeature && this.gamingCapabilities.thermalModeVersion === 2) {
			this.thermalModeRealStatus = this.commonService.getLocalStorageValue(LocalStorageKey.RealThermalModeStatus, 2);
			if (this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.gpuOCFeature) {
				if (this.gamingCapabilities.xtuService && this.gamingCapabilities.nvDriver) {
					this.performanceOCSettings = (this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) === 1) && (this.commonService.getLocalStorageValue(LocalStorageKey.GpuOCStatus) === 1);
				}
			} else if (this.gamingCapabilities.cpuOCFeature && !this.gamingCapabilities.gpuOCFeature) {
				if (this.gamingCapabilities.xtuService) {
					this.performanceOCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) === 1;
				}
			} else if (!this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.gpuOCFeature) {
				if (this.gamingCapabilities.nvDriver) {
					this.performanceOCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.GpuOCStatus) === 1;
				}
			}
		}

		// Feature 2: CPU over lock status
		if (this.gamingCapabilities.thermalModeVersion === 1 && this.gamingCapabilities.cpuOCFeature) {
			this.drop.curSelected = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus, 1)
		}

		// Feature 3: memory over lock status
		if (this.gamingCapabilities.memOCFeature) {
			this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.memOCFeatureStatus, false);
		}

		// Feature 4: network boost status
		if (this.gamingCapabilities.networkBoostFeature) {
			this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoostStatus, false);
		}

		// Feature 5: auto close status
		if (this.gamingCapabilities.optimizationFeature) {
			this.legionUpdate[this.legionItemIndex.autoClose].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus, false);
		}

		// Feature 6: hybrid mode status
		if (this.gamingCapabilities.hybridModeFeature) {
			this.legionUpdate[this.legionItemIndex.hybridMode].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus, false);
		}

		// Feature 7: over drive status
		if (this.gamingCapabilities.overDriveFeature) {
			this.legionUpdate[this.legionItemIndex.overDrive].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.overDriveStatus, true);
		}
		// Feature 8: touchpad lock status
		if (this.gamingCapabilities.touchpadLockFeature) {
			this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = this.gamingCapabilities.touchpadLockStatus;
		}

		//////////////////////////////////////////////////////////////////////
		// Initialize Legion Edge component
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
		// Render isvisible according to gamingCapabilities
		// Feature 2: CPU over clock
		// Version 3.2
		if (this.gamingCapabilities.thermalModeVersion === 2) {
			this.legionUpdate[this.legionItemIndex.cpuOverclock].isVisible = false;
		} else {
			this.legionUpdate[this.legionItemIndex.cpuOverclock].isVisible = this.gamingCapabilities.cpuOCFeature;
			if (!this.gamingCapabilities.xtuService) {
				this.drop.hideDropDown = true;
			} else {
				this.drop.hideDropDown = false;
			}
		}

		// Feature 3: memory over clock
		this.legionUpdate[this.legionItemIndex.ramOverlock].isVisible = this.gamingCapabilities.memOCFeature;

		// Feature 4: network boost
		this.legionUpdate[this.legionItemIndex.networkBoost].isVisible = this.gamingCapabilities.networkBoostFeature || false;
		if (this.gamingCapabilities.fbnetFilter) {
			this.legionUpdate[this.legionItemIndex.networkBoost].readonly = false;
		} else {
			this.legionUpdate[this.legionItemIndex.networkBoost].readonly = true;
		}

		// Feature 5: auto close 
		this.legionUpdate[this.legionItemIndex.autoClose].isVisible = this.gamingCapabilities.optimizationFeature || false;

		// Feature 6: hybrid mode
		this.legionUpdate[this.legionItemIndex.hybridMode].isVisible = this.gamingCapabilities.hybridModeFeature;

		// Feature 7: over drive
		this.legionUpdate[this.legionItemIndex.overDrive].isVisible = this.gamingCapabilities.overDriveFeature;

		// Feature 8: touchpad lock
		this.legionUpdate[this.legionItemIndex.touchpadLock].isVisible = this.gamingCapabilities.touchpadLockFeature;

		/////////////////////////////////////////////////////////////////////////////////////////
		// Get status from JSbridge
		// Feature 1: Thermal Mode 2 & performanceOC
		// Version 3.2
		if (this.gamingCapabilities.smartFanFeature && this.gamingCapabilities.thermalModeVersion === 2) {
			this.thermalModeEvent = this.onRegThermalModeRealStatusChangeEvent.bind(this);
			this.renderThermalMode2RealStatus();
			this.registerThermalModeRealStatusChangeEvent();
			if (this.gamingCapabilities.cpuOCFeature || this.gamingCapabilities.gpuOCFeature) {
				this.renderThermalMode2OCSettings();
			}
		}

		// Feature 2: CPU over clock
		if (this.gamingCapabilities.thermalModeVersion === 1 && this.gamingCapabilities.cpuOCFeature) {
			this.renderCPUOverClockStatus();
		}

		// Feature 3: memory over clock
		if (this.gamingCapabilities.memOCFeature) {
			this.renderRamOverClockStatus();
		}

		// Feature 4: network boost 
		if (this.gamingCapabilities.networkBoostFeature) {
			// this.legionUpdate[2].readonly = false;
			this.renderNetworkBoostStatus();
		}

		// Feature 5: auto close
		if (this.gamingCapabilities.optimizationFeature) {
			this.renderAutoCloseStatus();
		}

		// Feature 6: hybrid mode
		if (this.gamingCapabilities.hybridModeFeature) {
			this.renderHybridModeStatus();
		}

		// Feature 7: over drive
		if (this.gamingCapabilities.overDriveFeature) {
			this.renderOverDriveStatus();
		}

		// Feature 8: touchpad lock
		if (this.gamingCapabilities.touchpadLockFeature && this.gamingCapabilities.winKeyLockFeature) {
			this.renderTouchpadLockStatus();
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Version 3.2: get real status of thermal mode 2 from JSBridge
	public renderThermalMode2RealStatus() {
		try {
			this.gamingThermalModeService.getThermalModeRealStatus().then(res => {
				this.logger.info(`Widget-LegionEdge-RenderThermalMode2RealStatus: get value from ${this.thermalModeRealStatus} to ${res}`);
				if (res !== this.thermalModeRealStatus && res !== undefined) {
					this.thermalModeRealStatus = res;
					this.commonService.setLocalStorageValue(LocalStorageKey.RealThermalModeStatus, this.thermalModeRealStatus);
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-RenderThermalMode2RealStatus: get fail; Error message: ', error.message);
		}
	}
	// Version 3.2: register thermal mode real status event
	public registerThermalModeRealStatusChangeEvent() {
		if (this.gamingCapabilities.smartFanFeature) {
			try {
				this.gamingThermalModeService.regThermalModeRealStatusChangeEvent();
				this.shellServices.registerEvent(
					EventTypes.gamingThermalModeRealStatusChangeEvent,
					this.thermalModeEvent
				);
				this.logger.info('Widget-LegionEdge-RegisterThermalModeRealStatusChangeEvent: register success');
			} catch (error) {
				this.logger.error('Widget-LegionEdge-RegisterThermalModeRealStatusChangeEvent: register fail; Error message: ', error.message);
				throw new Error(error.message);
			}

		}
	}
	// Version 3.2: unregister thermal mode real status event
	public unRegisterThermalModeRealStatusChangeEvent() {
		this.shellServices.unRegisterEvent(
			EventTypes.gamingThermalModeRealStatusChangeEvent,
			this.thermalModeEvent
		);
	}
	// Version 3.2: callback of thermal mode real status event
	public onRegThermalModeRealStatusChangeEvent(currentRealStatus: any) {
		this.ngZone.run(() => {
			this.logger.info(`Widget-LegionEdge-OnRegThermalModeRealStatusChangeEvent: call back from ${this.thermalModeRealStatus} to ${currentRealStatus}`);
			if (currentRealStatus !== undefined && this.thermalModeRealStatus !== currentRealStatus) {
				this.thermalModeRealStatus = currentRealStatus;
				this.commonService.setLocalStorageValue(LocalStorageKey.RealThermalModeStatus, this.thermalModeRealStatus);
			}
		});
	}
	// Version 3.2: get performanceOC status from JSBridge
	public renderThermalMode2OCSettings() {
		try {
			this.gamingOCService.getPerformanceOCSetting().then(res => {
				this.logger.info(`Widget-LegionEdge-RenderThermalMode2OCSettings: get value from ${this.performanceOCSettings} to ${res}`);
				if (this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.xtuService && this.gamingCapabilities.nvDriver) {
						this.performanceOCSettings = res;
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.performanceOCSettings ? 1 : 3);
						this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, this.performanceOCSettings ? 1 : 3);
					} else {
						this.performanceOCSettings = false;
					}
				} else if (this.gamingCapabilities.cpuOCFeature && !this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.xtuService) {
						this.performanceOCSettings = res;
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.performanceOCSettings ? 1 : 3);
					} else {
						this.performanceOCSettings = false;
					}
				} else if (!this.gamingCapabilities.cpuOCFeature && this.gamingCapabilities.gpuOCFeature) {
					if (this.gamingCapabilities.nvDriver) {
						this.performanceOCSettings = res;
						this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, this.performanceOCSettings ? 1 : 3);
					} else {
						this.performanceOCSettings = false;
					}
				} else {
					this.performanceOCSettings = false;
				}
			});
		} catch (error) {
			this.performanceOCSettings = false;
			this.logger.error('Widget-LegionEdge-RenderThermalMode2OCSettings: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}
	// Version 3.2: open popup of thermal mode 2
	openThermalMode2Modal() {
		const modalRef = this.modalService.open(ModalGamingThermalMode2Component, { backdrop: 'static', windowClass: 'modal-fun' });
		modalRef.componentInstance.OCSettingsMsg.subscribe(res => {
			this.performanceOCSettings = res;
		});
	}

	//////////////////////////////////////////////////////////////////////
	// open popup of legion edge help
	openModal() {
		this.modalService.open(ModalGamingLegionedgeComponent, { backdrop: true, windowClass: 'gaming-help-modal' });
	}

	//////////////////////////////////////////////////////////////////////
	// get CPU over clock status from JSBridge
	public renderCPUOverClockStatus() {
		try {
			this.gamingSystemUpdateService.getCpuOCStatus().then((cpuOCStatus) => {
				this.logger.info(`Widget-LegionEdge-renderCPUOverClockStatus: get value from ${this.drop.curSelected} to ${cpuOCStatus}`);
				if (cpuOCStatus !== undefined) {
					if (cpuOCStatus !== this.drop.curSelected) {
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, cpuOCStatus);
					}
					this.drop.curSelected = cpuOCStatus;
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderCPUOverClockStatus: get fail; Error message: ', error.message);
		}
	}
	// set CPU Over clock status
	onOptionSelected(event: any) {
		if (event.target.name === 'gaming.dashboard.device.legionEdge.title') {
			this.gamingSystemUpdateService.setCpuOCStatus(this.setCpuOCStatus.cpuOCStatus).then((value: boolean) => {
				this.logger.info(`Widget-LegionEdge-onOptionSelected: set value to ${event.option.value}, return value is ${value}`);
				if (!value) {
					this.drop.curSelected = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus, 1);
				} else {
					this.drop.curSelected = this.setCpuOCStatus.cpuOCStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.drop.curSelected);
				}
			}).catch((error) => {
				this.logger.error('Widget-LegionEdge-onOptionSelected: set fail; Error message: ', error.message);
			});
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Get memory over clock status from JSBridge
	public renderRamOverClockStatus() {
		if (this.gamingCapabilities.xtuService === true) {
			try {
				this.gamingSystemUpdateService.getRamOCStatus().then((ramOcStatus) => {
					this.logger.info(`Widget-LegionEdge-renderRamOverClockStatus: get value from ${this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked} to ${ramOcStatus}`);
					if (ramOcStatus !== undefined) {
						this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked = ramOcStatus;
						this.commonService.setLocalStorageValue(LocalStorageKey.memOCFeatureStatus, ramOcStatus);
					}
				});
			} catch (error) {
				this.logger.error('Widget-LegionEdge-renderRamOverClockStatus: get fail; Error message: ', error.message);
			}
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Get network boost status from JSBridge
	public renderNetworkBoostStatus() {
		try {
			this.gamingNetworkBoostService.getNetworkBoostStatus().then((networkBoostModeStatus) => {
				this.logger.info(`Widget-LegionEdge-renderNetworkBoostStatus: get value from ${this.legionUpdate[this.legionItemIndex.networkBoost].isChecked} to ${networkBoostModeStatus}`);
				if (networkBoostModeStatus !== undefined) {
					this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, networkBoostModeStatus);
					this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = networkBoostModeStatus;
					if (!networkBoostModeStatus) {
						if (this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup) === 2) {
							this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup, 1);
						}
					}
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderNetworkBoostStatus: get fail; Error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Get auto close status from JSBridge
	public renderAutoCloseStatus() {
		try {
			this.gamingAutoCloseService.getAutoCloseStatus().then((autoCloseModeStatus) => {
				this.logger.info(`Widget-LegionEdge-renderAutoCloseStatus: get value from ${this.legionUpdate[this.legionItemIndex.autoClose].isChecked} to ${autoCloseModeStatus}`);
				if (autoCloseModeStatus !== undefined) {
					this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseStatus, autoCloseModeStatus);
					this.legionUpdate[this.legionItemIndex.autoClose].isChecked = autoCloseModeStatus;
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderAutoCloseStatus: get fail; Error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Get hybrid mode status from JSBridge
	public renderHybridModeStatus() {
		try {
			this.gamingHybridModeService.getHybridModeStatus().then((hybridModeStatus) => {
				this.logger.info(`Widget-LegionEdge-renderHybridModeStatus: get value from ${this.legionUpdate[this.legionItemIndex.hybridMode].isChecked} to ${hybridModeStatus}`);
				if (hybridModeStatus !== undefined) {
					this.legionUpdate[this.legionItemIndex.hybridMode].isChecked = hybridModeStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus, hybridModeStatus);
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderHybridModeStatus: get fail; Error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Get over drive status from JSBridge
	renderOverDriveStatus() {
		try {
			this.gamingOverDriveService.getOverDriveStatus().then(res => {
				this.logger.info(`Widget-LegionEdge-intiOverDriveStatus: get value from ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked} to ${res}`);
				if (res !== this.legionUpdate[this.legionItemIndex.overDrive].isChecked && res !== undefined) {
					this.legionUpdate[this.legionItemIndex.overDrive].isChecked = res;
					this.commonService.setLocalStorageValue(LocalStorageKey.overDriveStatus, res)
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-intiOverDriveStatus: get fail; Error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Get touchpad lock status from JSBridge
	public renderTouchpadLockStatus() {
		try {
			this.gamingKeyLockService.getKeyLockStatus().then((touchpadLockStatus) => {
				this.logger.info(`Widget-LegionEdge-renderTouchpadLockStatus: get value from ${this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked} to ${touchpadLockStatus}`);
				if (touchpadLockStatus !== undefined) {
					this.commonService.setLocalStorageValue(LocalStorageKey.TouchpadLockStatus, touchpadLockStatus);
					this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = touchpadLockStatus;
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderTouchpadLockStatus: get fail; Error message: ', error.message);
		}
	}

	
	//////////////////////////////////////////////////////////////////////
	// TODO
	public async setAutoCloseStatus(status: any) {
		try {
			const isStatusUpdated = await this.gamingAutoCloseService.setAutoCloseStatus(status);
			if (isStatusUpdated) {
				this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseStatus, status);
			}
		} catch (err) { }
	}

	public async setNetworkBoostStatus(status: any) {
		try {
			const isStatusUpdated = await this.gamingNetworkBoostService.setNetworkBoostStatus(status);
			if (isStatusUpdated) {
				this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, status);
				this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = status;
			} else {
				this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = !status;
			}
		} catch (err) { }
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
			this.gamingKeyLockService.setKeyLockStatus(status).then((value: boolean) => {
				if (value) {
					this.commonService.setLocalStorageValue(LocalStorageKey.TouchpadLockStatus, status);
				} else {
				}
			}).catch((error) => { });
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
				this.gamingOverDriveService.setOverDriveStatus(status).then(res => {
					if (res) {
						this.logger.info(`Widget-LegionEdge-toggleOnOffRamOCStatus: set overDrive return value: ${res}, overDrive status from ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked} to ${status}`);
						this.legionUpdate[this.legionItemIndex.overDrive].isChecked = status;
						this.commonService.setLocalStorageValue(LocalStorageKey.overDriveStatus, status);
					} else {
						this.legionUpdate[this.legionItemIndex.overDrive].isChecked = !status;
						this.logger.error(`Widget-LegionEdge-toggleOnOffRamOCStatus: set overDrive return false, overDrive status keep ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked}`);
					}
				});
			} catch (error) {
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
