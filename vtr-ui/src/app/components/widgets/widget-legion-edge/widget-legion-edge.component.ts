import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventTypes } from '@lenovo/tan-client-bridge';
// model & enum
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Gaming } from 'src/app/enums/gaming.enum';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { GamingThermal2 } from 'src/app/enums/gaming-thermal2.enum';
import { AutomationId } from './../../../enums/automation-id.enum';
// service
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { GamingHybridModeService } from 'src/app/services/gaming/gaming-hybrid-mode/gaming-hybrid-mode.service';
import { GamingOverDriveService } from 'src/app/services/gaming/gaming-over-drive/gaming-over-drive.service';
import { GamingKeyLockService } from 'src/app/services/gaming/gaming-keylock/gaming-key-lock.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
// component
import { ModalGamingThermalMode2Component } from '../../modal/modal-gaming-thermal-mode2/modal-gaming-thermal-mode2.component';


@Component({
	selector: 'vtr-widget-legion-edge',
	templateUrl: './widget-legion-edge.component.html',
	styleUrls: ['./widget-legion-edge.component.scss']
})
export class WidgetLegionEdgeComponent implements OnInit, OnDestroy {
	public gamingCapabilities: GamingAllCapabilities = new GamingAllCapabilities();
	public disableButtons = false;
	// Version 3.2: thermal mode 2.0 & performance OC
	public thermalMode2Enum = GamingThermal2;
	public thermalModeRealStatus = this.thermalMode2Enum.balance;
	public thermalModeEvent: any;
	public performanceOCSettings = false;
	// Version 3.3: automation ID
	public legionPopupId:any;
	public legionHelpIconId:any;

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

	// item info in legion edge
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

	// CPU over clock dropdown info
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
		//////////////////////////////////////////////////////////////////////
		// Get capabilities from cache                                      //
		// Feature 0: Version 3.2, machine type                             //
		// Feature 1: Version 3.2, Thermal Mode 2 & performanceOC           //
		// Feature 2: CPU over clock                                        //
		// Feature 3: Memory over clock                                     //
		// Feature 4: Network boost                                         //
		// Feature 5: Auto close                                            //
		// Feature 6: Hybrid mode                                           //
		// Feature 7: Version 3.3, Over drive                               //
		// Feature 8: Touchpad lock                                         //
		//////////////////////////////////////////////////////////////////////
		this.gamingCapabilities.desktopType = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.desktopType);
		this.gamingCapabilities.liteGaming = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.liteGaming);

		this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.smartFanFeature);
		this.gamingCapabilities.thermalModeVersion = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.thermalModeVersion);
		this.gamingCapabilities.gpuOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.gpuOCFeature);
		this.gamingCapabilities.nvDriver = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.nvDriver);

		this.gamingCapabilities.cpuOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.cpuOCFeature);
		this.gamingCapabilities.xtuService = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.xtuService);

		this.gamingCapabilities.memOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.memOCFeature);

		this.gamingCapabilities.networkBoostFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.networkBoostFeature);
		this.gamingCapabilities.fbnetFilter = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.fbNetFilter);

		this.gamingCapabilities.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.optimizationFeature);

		this.gamingCapabilities.hybridModeFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.hybridModeFeature);

		this.gamingCapabilities.overDriveFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.overDriveFeature);

		this.gamingCapabilities.touchpadLockFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.touchpadLockFeature);
		this.gamingCapabilities.touchpadLockStatus = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.TouchpadLockStatus);
		this.gamingCapabilities.winKeyLockFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.winKeyLockFeature);

		//////////////////////////////////////////////////////////////////////
		// Get status from localStorage                                     //
		// Feature 1: Version 3.2, Thermal Mode 2 & performanceOC           //
		// Feature 2: CPU over clock                                        //
		// Feature 3: Memory over clock                                     //
		// Feature 4: Network boost                                         //
		// Feature 5: Auto close                                            //
		// Feature 6: Hybrid mode                                           //
		// Feature 7: Version 3.3, Over drive                               //
		// Feature 8: Touchpad lock                                         //
		//////////////////////////////////////////////////////////////////////
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

		if (this.gamingCapabilities.thermalModeVersion === 1 && this.gamingCapabilities.cpuOCFeature) {
			this.drop.curSelected = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus, 1)
		}

		if (this.gamingCapabilities.memOCFeature) {
			this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.memOCFeatureStatus, false);
		}

		if (this.gamingCapabilities.networkBoostFeature) {
			this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoostStatus, false);
		}

		if (this.gamingCapabilities.optimizationFeature) {
			this.legionUpdate[this.legionItemIndex.autoClose].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus, false);
		}

		if (this.gamingCapabilities.hybridModeFeature) {
			this.legionUpdate[this.legionItemIndex.hybridMode].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus, false);
		}

		if (this.gamingCapabilities.overDriveFeature) {
			this.legionUpdate[this.legionItemIndex.overDrive].isChecked = this.commonService.getLocalStorageValue(LocalStorageKey.overDriveStatus, true);
		}
		// TODO: Historical issue, this should be a status but not a gamingCapability
		if (this.gamingCapabilities.touchpadLockFeature) {
			this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = this.gamingCapabilities.touchpadLockStatus;
		}

		//////////////////////////////////////////////////////////////////////
		// Initialize Legion Edge component                                 //
		//////////////////////////////////////////////////////////////////////
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
		//////////////////////////////////////////////////////////////////////
		// Render isvisible according to gamingCapabilities                 //
		// Feature 2: CPU over clock                                        //
		// Feature 3: Memory over clock                                     //
		// Feature 4: Network boost                                         //
		// Feature 5: Auto close                                            //
		// Feature 6: Hybrid mode                                           //
		// Feature 7: Version 3.3, Over drive                               //
		// Feature 8: Touchpad lock                                         //
		//////////////////////////////////////////////////////////////////////
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

		this.legionUpdate[this.legionItemIndex.ramOverlock].isVisible = this.gamingCapabilities.memOCFeature;

		this.legionUpdate[this.legionItemIndex.networkBoost].isVisible = this.gamingCapabilities.networkBoostFeature || false;
		if (this.gamingCapabilities.fbnetFilter) {
			this.legionUpdate[this.legionItemIndex.networkBoost].readonly = false;
		} else {
			this.legionUpdate[this.legionItemIndex.networkBoost].readonly = true;
		}

		this.legionUpdate[this.legionItemIndex.autoClose].isVisible = this.gamingCapabilities.optimizationFeature || false;

		this.legionUpdate[this.legionItemIndex.hybridMode].isVisible = this.gamingCapabilities.hybridModeFeature;

		this.legionUpdate[this.legionItemIndex.overDrive].isVisible = this.gamingCapabilities.overDriveFeature;

		this.legionUpdate[this.legionItemIndex.touchpadLock].isVisible = this.gamingCapabilities.touchpadLockFeature;

		//////////////////////////////////////////////////////////////////////
		// Init status from JSbridge                                        //
		// Feature 1: Version 3.2, Thermal Mode 2 & performanceOC           //
		// Feature 2: CPU over clock                                        //
		// Feature 3: Memory over clock                                     //
		// Feature 4: Network boost                                         //
		// Feature 5: Auto close                                            //
		// Feature 6: Hybrid mode                                           //
		// Feature 7: Version 3.3, Over drive                               //
		// Feature 8: Touchpad lock                                         //
		//////////////////////////////////////////////////////////////////////
		if (this.gamingCapabilities.smartFanFeature && this.gamingCapabilities.thermalModeVersion === 2) {
			this.thermalModeEvent = this.onRegThermalModeRealStatusChangeEvent.bind(this);
			this.renderThermalMode2RealStatus();
			this.registerThermalModeRealStatusChangeEvent();
			if (this.gamingCapabilities.cpuOCFeature || this.gamingCapabilities.gpuOCFeature) {
				this.renderThermalMode2OCSettings();
			}
		}

		if (this.gamingCapabilities.thermalModeVersion === 1 && this.gamingCapabilities.cpuOCFeature) {
			this.renderCPUOverClockStatus();
		}

		if (this.gamingCapabilities.memOCFeature) {
			this.renderRamOverClockStatus();
		}

		if (this.gamingCapabilities.networkBoostFeature) {
			this.renderNetworkBoostStatus();
		}

		if (this.gamingCapabilities.optimizationFeature) {
			this.renderAutoCloseStatus();
		}

		if (this.gamingCapabilities.hybridModeFeature) {
			this.renderHybridModeStatus();
		}

		if (this.gamingCapabilities.overDriveFeature) {
			this.renderOverDriveStatus();
		}

		if (this.gamingCapabilities.touchpadLockFeature && this.gamingCapabilities.winKeyLockFeature) {
			this.renderTouchpadLockStatus();
		}

	}


	//////////////////////////////////////////////////////////////////////
	// Version 3.3: Init automation ID                                  //
	// 1. Get machine specific ID                                       //
	// 2. Get thermal mode automation ID                                //
	//////////////////////////////////////////////////////////////////////
	getThermalModeAutomationId() {
		const thermalStatus = {};
		thermalStatus[GamingThermal2.performance] = this.performanceOCSettings ? AutomationId.PerformanceOverclockOn : AutomationId.Performance;
		thermalStatus[GamingThermal2.balance] = AutomationId.Balance;
		thermalStatus[GamingThermal2.quiet] = AutomationId.Quiet;
		return thermalStatus[this.thermalModeRealStatus];
	}

	//////////////////////////////////////////////////////////////////////
	// Version 3.2: Thermal Mode 2 & PerformanceOC                      //
	// 1. Get real status of thermal mode 2 from JSBridge               //
	// 2. Register thermal mode real-status event                       //
	// 3. Unregister thermal mode real-status event                     //
	// 4. Callback of thermal mode real-status event                    //
	// 5. Get performanceOC status from JSBridge                        //
	// 6. Open popup of thermal mode 2                                  //
	//////////////////////////////////////////////////////////////////////
	renderThermalMode2RealStatus() {
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
	registerThermalModeRealStatusChangeEvent() {
		if (this.gamingCapabilities.smartFanFeature) {
			try {
				this.gamingThermalModeService.regThermalModeRealStatusChangeEvent();
				this.shellServices.registerEvent(EventTypes.gamingThermalModeRealStatusChangeEvent, this.thermalModeEvent);
				this.logger.info('Widget-LegionEdge-RegisterThermalModeRealStatusChangeEvent: register success');
			} catch (error) {
				this.logger.error('Widget-LegionEdge-RegisterThermalModeRealStatusChangeEvent: register fail; Error message: ', error.message);
			}
		}
	}
	unRegisterThermalModeRealStatusChangeEvent() {
		this.shellServices.unRegisterEvent(EventTypes.gamingThermalModeRealStatusChangeEvent, this.thermalModeEvent);
	}
	onRegThermalModeRealStatusChangeEvent(currentRealStatus: any) {
		this.ngZone.run(() => {
			this.logger.info(`Widget-LegionEdge-OnRegThermalModeRealStatusChangeEvent: call back from ${this.thermalModeRealStatus} to ${currentRealStatus}`);
			if (currentRealStatus !== undefined && this.thermalModeRealStatus !== currentRealStatus) {
				this.thermalModeRealStatus = currentRealStatus;
				this.commonService.setLocalStorageValue(LocalStorageKey.RealThermalModeStatus, this.thermalModeRealStatus);
			}
		});
	}
	renderThermalMode2OCSettings() {
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
		}
	}
	openThermalMode2Modal() {
		const modalRef = this.modalService.open(ModalGamingThermalMode2Component, { backdrop: 'static', windowClass: 'modal-fun' });
		modalRef.componentInstance.OCSettingsMsg.subscribe(res => {
			this.performanceOCSettings = res;
		});
	}

	//////////////////////////////////////////////////////////////////////
	// Open popup of legion edge help                                   //
	//////////////////////////////////////////////////////////////////////
	openModal() {
		this.modalService.open(ModalGamingLegionedgeComponent, { backdrop: true, windowClass: 'gaming-help-modal' });
	}

	//////////////////////////////////////////////////////////////////////
	// Original: CPU over clock                                         //
	// 1. Get CPU over clock status from JSBridge                       //
	// 2. Set CPU Over clock status                                     //
	// 3. Show dropdown of CPU over clock                               //
	//////////////////////////////////////////////////////////////////////
	renderCPUOverClockStatus() {
		try {
			this.gamingSystemUpdateService.getCpuOCStatus().then((cpuOCStatus) => {
				this.logger.info(`Widget-LegionEdge-renderCPUOverClockStatus: get value from ${this.drop.curSelected} to ${cpuOCStatus}`);
				if (cpuOCStatus !== undefined && cpuOCStatus !== this.drop.curSelected) {
					this.drop.curSelected = cpuOCStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, cpuOCStatus);
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderCPUOverClockStatus: get fail; Error message: ', error.message);
		}
	}
	onOptionSelected(event: any) {
		if (event.target.name === 'gaming.dashboard.device.legionEdge.title') {
			try {
				this.gamingSystemUpdateService.setCpuOCStatus(event.option.value).then((value: boolean) => {
					this.logger.info(`Widget-LegionEdge-onOptionSelected: set value to ${event.option.value}, return value is ${value}`);
					if (value) {
						this.drop.curSelected = event.option.value;
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.drop.curSelected);
					} else {
						this.drop.curSelected = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus, 1);
					}
				})
			} catch (error) {
				this.drop.curSelected = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus, 1);
				this.logger.error('Widget-LegionEdge-onOptionSelected: set fail; Error message: ', error.message);
			}
		}
	}
	onShowDropdown(event) {
		if (event.type === 'gaming.dashboard.device.legionEdge.title') {
			if (this.drop.hideDropDown) {
				// TODO
				// this.closeLegionEdgePopups();
				this.legionUpdate[this.legionItemIndex.cpuOverclock].isDriverPopup = true;
			}
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Original: Memory over clock                                      //
	// 1. Get memory over clock status from JSBridge                    //
	// 2. Set memory Over clock status                                  //
	//////////////////////////////////////////////////////////////////////
	renderRamOverClockStatus() {
		if (this.gamingCapabilities.xtuService === true) {
			try {
				this.gamingSystemUpdateService.getRamOCStatus().then((ramOcStatus) => {
					this.logger.info(`Widget-LegionEdge-renderRamOverClockStatus: get value from ${this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked} to ${ramOcStatus}`);
					if (ramOcStatus !== undefined && ramOcStatus !== this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked) {
						this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked = ramOcStatus;
						this.commonService.setLocalStorageValue(LocalStorageKey.memOCFeatureStatus, ramOcStatus);
					}
				});
			} catch (error) {
				this.logger.error('Widget-LegionEdge-renderRamOverClockStatus: get fail; Error message: ', error.message);
			}
		}
	}
	setRamOverClockStatus(status: any) {
		try {
			this.gamingSystemUpdateService.setRamOCStatus(status).then((res: boolean) => {
				// the status and cache will update after reboot
				this.logger.info(`Widget-LegionEdge-setRamOverClockStatus: set value to ${status}, ande return value is ${res}`);
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-setRamOverClockStatus: set fail; Error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Original: Network work                                           //
	// 1. Get network boost status from JSBridge                        //
	// 2. Set network boost status                                      //
	//////////////////////////////////////////////////////////////////////
	renderNetworkBoostStatus() {
		try {
			this.gamingNetworkBoostService.getNetworkBoostStatus().then((networkBoostModeStatus) => {
				this.logger.info(`Widget-LegionEdge-renderNetworkBoostStatus: get value from ${this.legionUpdate[this.legionItemIndex.networkBoost].isChecked} to ${networkBoostModeStatus}`);
				if (networkBoostModeStatus !== undefined && networkBoostModeStatus !== this.legionUpdate[this.legionItemIndex.networkBoost].isChecked) {
					this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = networkBoostModeStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, networkBoostModeStatus);
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
	setNetworkBoostStatus(status: any) {
		try {
			this.gamingNetworkBoostService.setNetworkBoostStatus(status).then((res) => {
				this.logger.info(`Widget-LegionEdge-setNetworkBoostStatus: set value to ${status}, ande return value is ${res}`);
				if (res) {
					this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = status;
					this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, status);
				} else {
					this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = !status;
				}
			});
		} catch (error) {
			this.legionUpdate[this.legionItemIndex.networkBoost].isChecked = !status;
			this.logger.error('Widget-LegionEdge-setNetworkBoostStatus: set fail; Error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Original: Auto close                                             //
	// 1. Get auto close status from JSBridge                           //
	// 2. Set auto close status                                         //
	//////////////////////////////////////////////////////////////////////
	renderAutoCloseStatus() {
		try {
			this.gamingAutoCloseService.getAutoCloseStatus().then((autoCloseModeStatus) => {
				this.logger.info(`Widget-LegionEdge-renderAutoCloseStatus: get value from ${this.legionUpdate[this.legionItemIndex.autoClose].isChecked} to ${autoCloseModeStatus}`);
				if (autoCloseModeStatus !== undefined && autoCloseModeStatus !== this.legionUpdate[this.legionItemIndex.autoClose].isChecked) {
					this.legionUpdate[this.legionItemIndex.autoClose].isChecked = autoCloseModeStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseStatus, autoCloseModeStatus);
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderAutoCloseStatus: get fail; Error message: ', error.message);
		}
	}
	setAutoCloseStatus(status: any) {
		try {
			this.gamingAutoCloseService.setAutoCloseStatus(status).then((res) => {
				this.logger.info(`Widget-LegionEdge-setAutoCloseStatus: set value to ${status}, ande return value is ${res}`);
				if (res) {
					this.legionUpdate[this.legionItemIndex.autoClose].isChecked = status;
					this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseStatus, status);
				} else {
					this.legionUpdate[this.legionItemIndex.autoClose].isChecked = !status;
				}
			});
		} catch (error) {
			this.legionUpdate[this.legionItemIndex.autoClose].isChecked = !status;
			this.logger.error('Widget-LegionEdge-setAutoCloseStatus: set fail; Error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Original: Hybrid mode                                            //
	// 1. Get hybrid mode status from JSBridge                          //
	// 2. Set hybrid mode status                                        //
	//////////////////////////////////////////////////////////////////////
	renderHybridModeStatus() {
		try {
			this.gamingHybridModeService.getHybridModeStatus().then((hybridModeStatus) => {
				this.logger.info(`Widget-LegionEdge-renderHybridModeStatus: get value from ${this.legionUpdate[this.legionItemIndex.hybridMode].isChecked} to ${hybridModeStatus}`);
				if (hybridModeStatus !== undefined && hybridModeStatus !== this.legionUpdate[this.legionItemIndex.hybridMode].isChecked) {
					this.legionUpdate[this.legionItemIndex.hybridMode].isChecked = hybridModeStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus, hybridModeStatus);
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderHybridModeStatus: get fail; Error message: ', error.message);
		}
	}
	setHybridModeStatus(status: any) {
		try {
			this.gamingHybridModeService.setHybridModeStatus(status).then((res: boolean) => {
				// the status and cache will update after reboot
				this.logger.info(`Widget-LegionEdge-setHybridModeStatus: set value to ${status}, ande return value is ${res}`);
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-setHybridModeStatus: set fail; Error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Version 3.3: Over drive                                          //
	// 1. Get over drive status from JSBridge                           //
	// 2. Set over drive status                                         //
	//////////////////////////////////////////////////////////////////////
	renderOverDriveStatus() {
		try {
			this.gamingOverDriveService.getOverDriveStatus().then(res => {
				this.logger.info(`Widget-LegionEdge-renderOverDriveStatus: get value from ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked} to ${res}`);
				if (res !== undefined && res !== this.legionUpdate[this.legionItemIndex.overDrive].isChecked) {
					this.legionUpdate[this.legionItemIndex.overDrive].isChecked = res;
					this.commonService.setLocalStorageValue(LocalStorageKey.overDriveStatus, res)
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderOverDriveStatus: get fail; Error message: ', error.message);
		}
	}
	setOverDriveStatus(status: any) {
		try {
			this.gamingOverDriveService.setOverDriveStatus(status).then(res => {
				if (res) {
					this.logger.info(`Widget-LegionEdge-setOverDriveStatus: set overDrive return value: ${res}, overDrive status from ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked} to ${status}`);
					this.legionUpdate[this.legionItemIndex.overDrive].isChecked = status;
					this.commonService.setLocalStorageValue(LocalStorageKey.overDriveStatus, status);
				} else {
					this.legionUpdate[this.legionItemIndex.overDrive].isChecked = !status;
					this.logger.error(`Widget-LegionEdge-setOverDriveStatus: set overDrive return false, overDrive status keep ${this.legionUpdate[this.legionItemIndex.overDrive].isChecked}`);
				}
			});
		} catch (error) {
			this.legionUpdate[this.legionItemIndex.overDrive].isChecked = !status;
			this.logger.error('Widget-LegionEdge-setOverDriveStatus: set overDrive fail, error message: ', error.message);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Original: Touchpad lock                                          //
	// 1. Get touchpad lock status from JSBridge                        //
	// 2. Set touchpad lock status                                      //
	//////////////////////////////////////////////////////////////////////
	renderTouchpadLockStatus() {
		try {
			this.gamingKeyLockService.getKeyLockStatus().then((touchpadLockStatus) => {
				this.logger.info(`Widget-LegionEdge-renderTouchpadLockStatus: get value from ${this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked} to ${touchpadLockStatus}`);
				if (touchpadLockStatus !== undefined && touchpadLockStatus !== this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked) {
					this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = touchpadLockStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.TouchpadLockStatus, touchpadLockStatus);
				}
			});
		} catch (error) {
			this.logger.error('Widget-LegionEdge-renderTouchpadLockStatus: get fail; Error message: ', error.message);
		}
	}
	setTouchpadLockStatus(status: any) {
		try {
			this.gamingKeyLockService.setKeyLockStatus(status).then((res: boolean) => {
				this.logger.info(`Widget-LegionEdge-setTouchpadLockStatus: set value to ${status}, ande return value is ${res}`);
				if (res) {
					this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = status;
					this.commonService.setLocalStorageValue(LocalStorageKey.TouchpadLockStatus, status);
				} else {
					this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = !status;
					this.logger.error(`Widget-LegionEdge-setTouchpadLockStatus: set touchpadLock Status return false, touchpadLock status keep ${this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked}`);
				}
			});
		} catch (error) {
			this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked = !status;
			this.logger.error(`Widget-LegionEdge-setTouchpadLockStatus: set touchpadLock Status error, touchpadLock status keep ${this.legionUpdate[this.legionItemIndex.touchpadLock].isChecked}`);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// TODO Similar to onPopupClosed()                                  //
	// What is the purpose of this function?                            //
	// If pass the test of PA, remove the code that commented by TODO   //
	//////////////////////////////////////////////////////////////////////
	// public closeLegionEdgePopups() {
	// 	Object.entries(this.legionUpdate).forEach(([key]) => {
	// 		this.legionUpdate[key].isDriverPopup = false;
	// 		this.legionUpdate[key].isPopup = false;
	// 	});
	// }

	//////////////////////////////////////////////////////////////////////
	// TODO Common function: Close popup windows                        //
	// Such as driver lack or reboot notifactions                       //
	// But name isn't equal to $event                                   //
	// And popup windows can close normaly without this function        //
	// If pass the test of PA, remove the code that commented by TODO   //
	//////////////////////////////////////////////////////////////////////
	public onPopupClosed($event) {
		// const name = $event;
		// if (name === 'gaming.dashboard.device.legionEdge.title') {
		// 	this.legionUpdate[this.legionItemIndex.cpuOverclock].isDriverPopup = false;
		// 	this.legionUpdate[this.legionItemIndex.cpuOverclock].isPopup = false;
		// }
		// if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
		// 	this.legionUpdate[this.legionItemIndex.ramOverlock].isDriverPopup = false;
		// 	this.legionUpdate[this.legionItemIndex.ramOverlock].isPopup = false;
		// 	this.commonService.sendNotification(name, this.legionUpdate[this.legionItemIndex.ramOverlock].isChecked);
		// }
		// if (name === 'gaming.dashboard.device.legionEdge.networkBoost') {
		// 	this.legionUpdate[this.legionItemIndex.networkBoost].isDriverPopup = false;
		// 	this.legionUpdate[this.legionItemIndex.networkBoost].isPopup = false;
		// }
		// if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
		// 	this.legionUpdate[this.legionItemIndex.hybridMode].isPopup = false;
		// 	this.commonService.sendNotification(name, this.legionUpdate[this.legionItemIndex.hybridMode].isChecked);
		// }
	}

	//////////////////////////////////////////////////////////////////////
	// Common function: Icon for routing                                //
	// Feature 4: Network boost                                         //
	// Feature 5: Auto close                                            //
	//////////////////////////////////////////////////////////////////////
	onIconClick(event: any) {
		this.logger.info(`Widget-LegionEdge-onIconClick: event.name value is ${event.name}`);
		// TODO
		// this.closeLegionEdgePopups();
		if (event.name === 'gaming.dashboard.device.legionEdge.networkBoost') {
			if (this.gamingCapabilities.fbnetFilter) {
				this.router.navigate(['/gaming/networkboost']);
			} else {
				this.legionUpdate[this.legionItemIndex.networkBoost].isDriverPopup = true;
				this.logger.error(`Widget-LegionEdge-onIconClick: event.name is ${event.name}, fbnetFilter is ${this.gamingCapabilities.fbnetFilter}`);
			}
		}
		if (event.name === 'gaming.dashboard.device.legionEdge.autoClose') {
			this.router.navigate(['/gaming/autoclose']);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Common function: Toggle on/off status                            //
	// Feature 3: Memory over clock                                     //
	// Feature 4: Network boost                                         //
	// Feature 5: Auto close                                            //
	// Feature 6: Hybrid mode                                           //
	// Feature 7: Version 3.3, Over drive                               //
	// Feature 8: Touchpad lock                                         //
	//////////////////////////////////////////////////////////////////////
	toggleOnOffStatus($event) {
		let name = $event.target.name;
		let status = $event.target.value;
		status = status === 'false' ? false : status;
		status = status === 'true' ? true : status;
		// TODO
		// this.closeLegionEdgePopups();
		this.logger.info(`Widget-LegionEdge-toggleOnOffStatus: event name is ${name}, event status is ${status}`);
		if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			if (this.gamingCapabilities.xtuService) {
				this.legionUpdate[this.legionItemIndex.ramOverlock].isPopup = true;
				this.setRamOverClockStatus(!status);
			} else {
				this.legionUpdate[this.legionItemIndex.ramOverlock].isDriverPopup = true;
				this.logger.error(`Widget-LegionEdge-toggleOnOffStatus: event name is ${name}, xtuService is ${this.gamingCapabilities.xtuService}`);
			}
		}

		if (name === 'gaming.dashboard.device.legionEdge.networkBoost') {
			if (this.gamingCapabilities.fbnetFilter) {
				this.setNetworkBoostStatus(status);
			} else {
				this.legionUpdate[this.legionItemIndex.networkBoost].isDriverPopup = true;
				this.logger.error(`Widget-LegionEdge-toggleOnOffStatus: event name is ${name}, fbnetFilter is ${this.gamingCapabilities.fbnetFilter}`);
			}
		}

		if (name === 'gaming.dashboard.device.legionEdge.autoClose') {
			this.setAutoCloseStatus(status);
		}

		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.legionUpdate[this.legionItemIndex.hybridMode].isPopup = true;
			this.setHybridModeStatus(!status);
		}

		if (name === 'gaming.dashboard.device.legionEdge.overDrive') {
			this.setOverDriveStatus(status);
		}

		if (name === 'gaming.dashboard.device.legionEdge.touchpadLock') {
			this.setTouchpadLockStatus(status);
		}
	}
}
