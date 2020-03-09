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
	constructor(
		private modalService: NgbModal,
		private ngZone: NgZone,
		private gamingSystemUpdateService: GamingSystemUpdateService,
		private gamingAllCapabilities: GamingAllCapabilitiesService,
		private commonService: CommonService,
		private gamingKeyLockService: GamingKeyLockService,
		private gamingHybridModeService: GamingHybridModeService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private gamingNetworkBoostService: NetworkBoostService,
		private gamingAutoCloseService: GamingAutoCloseService,
		private router: Router
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
		this.cacheMemOCFeature = this.commonService.getLocalStorageValue(LocalStorageKey.memOCFeatureStatus);
		this.legionUpdate[1].isChecked = this.cacheMemOCFeature;

		this.cacheHybridModeFeature = this.commonService.getLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus);
		this.legionUpdate[4].isChecked = this.cacheHybridModeFeature;

		this.cacheAutoCloseFeature = this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus);
		this.legionUpdate[3].isChecked = this.cacheAutoCloseFeature;
		this.legionUpdate[2].isChecked = this.getNetworkBoostCacheStatus();
		// Initialize Legion Edge component from cache
		this.legionEdgeInit();
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.gamingCapabilities = response.payload;
				this.legionEdgeInit();
			}
		});
	}

	legionEdgeInit() {
		const gamingStatus = this.gamingCapabilities;
		this.legionUpdate[0].isVisible = gamingStatus.cpuOCFeature;
		this.legionUpdate[1].isVisible = gamingStatus.memOCFeature;
		this.legionUpdate[3].isVisible = gamingStatus.optimizationFeature || false;
		this.legionUpdate[2].isVisible = gamingStatus.networkBoostFeature || false;
		this.legionUpdate[4].isVisible = gamingStatus.hybridModeFeature;
		this.legionUpdate[5].isVisible = gamingStatus.touchpadLockFeature;
		this.legionUpdate[5].isChecked = gamingStatus.touchpadLockStatus;
		if (gamingStatus.fbnetFilter) {
			this.legionUpdate[2].readonly = false;
		} else {
			this.legionUpdate[2].readonly = true;
		}
		if (!gamingStatus.xtuService) {
			this.drop.hideDropDown = true;
		} else {
			this.drop.hideDropDown = false;
		}

		if (gamingStatus.cpuOCFeature) {
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
	}

	public renderAutoCloseStatus() {
		this.gamingAutoCloseService.getAutoCloseStatus().then((autoCloseModeStatus) => {
			if (autoCloseModeStatus !== undefined) {
				this.autoCloseStatusObj.autoCloseStatus = autoCloseModeStatus;
				this.setAutoCloseCacheStatus(autoCloseModeStatus);
				this.legionUpdate[3].isChecked = autoCloseModeStatus;
			}
		});
	}

	public renderNetworkBoostStatus() {
		this.gamingNetworkBoostService.getNetworkBoostStatus().then((networkBoostModeStatus) => {
            if (networkBoostModeStatus !== undefined) {
				this.NetworkBoostStatusObj.networkBoostStatus = networkBoostModeStatus;
				this.setNetworkBoostCacheStatus(networkBoostModeStatus);
				this.legionUpdate[2].isChecked = networkBoostModeStatus;
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
				this.legionUpdate[2].isChecked = status;
			} else {
                this.legionUpdate[2].isChecked = !status;
            }
        } catch (err) {}
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
	public renderRamOverClockStatus() {
		if (this.gamingCapabilities.xtuService === true) {
			this.gamingSystemUpdateService.getRamOCStatus().then((ramOcStatus) => {
				if (ramOcStatus !== undefined) {
					this.RamOCSatusObj.ramOcStatus = ramOcStatus;

					this.legionUpdate[1].isChecked = ramOcStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.memOCFeatureStatus, ramOcStatus);
				}
			});
		}
	}

	public renderHybridModeStatus() {
		this.gamingHybridModeService.getHybridModeStatus().then((hybridModeStatus) => {
			if (hybridModeStatus !== undefined) {
				this.HybrimodeStatusObj.hybridModeStatus = hybridModeStatus;
				this.legionUpdate[4].isChecked = hybridModeStatus;
				this.commonService.setLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus, hybridModeStatus);
			}
		});
	}
	public renderTouchpadLockStatus() {
		// value from cache
		if (this.commonService !== undefined) {
			this.touchpadLockStatus = this.GetTouchpadLockCacheStatus();
			if (this.touchpadLockStatus !== undefined) {
				this.legionUpdate[5].isChecked = this.touchpadLockStatus;
			} else {
				// set default value from model property
				this.legionUpdate[5].isChecked = this.TouchpadLockStatusObj.touchpadLockStatus;
				this.SetTouchpadLockCacheStatus(this.TouchpadLockStatusObj.touchpadLockStatus);
			}
		}
		// value from js bridge
		this.gamingKeyLockService.getKeyLockStatus().then((touchpadLockStatus) => {
			if (touchpadLockStatus !== undefined) {
				this.TouchpadLockStatusObj.touchpadLockStatus = touchpadLockStatus;
				this.SetTouchpadLockCacheStatus(touchpadLockStatus);
				this.legionUpdate[5].isChecked = touchpadLockStatus;
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
			this.legionUpdate[1].isDriverPopup = false;
			this.legionUpdate[1].isPopup = false;
			this.commonService.sendNotification(name, this.legionUpdate[1].isChecked);
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.legionUpdate[4].isPopup = false;
			this.commonService.sendNotification(name, this.legionUpdate[4].isChecked);
		}
		if (name === 'gaming.dashboard.device.legionEdge.title') {
			this.legionUpdate[0].isDriverPopup = false;
			this.legionUpdate[0].isPopup = false;
		}
		if (name === 'gaming.dashboard.device.legionEdge.networkBoost') {
			this.legionUpdate[2].isDriverPopup = false;
			this.legionUpdate[2].isPopup = false;
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
				this.legionUpdate[1].isDriverPopup = true;
			} else {
				this.legionUpdate[1].isPopup = true;
			}
			this.gamingSystemUpdateService
				.setRamOCStatus(!status)
				.then((value: boolean) => { })
				.catch((error) => { });
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.legionUpdate[4].isPopup = true;
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
				this.legionUpdate[2].isDriverPopup = true;
			} else {
				await this.setNetworkBoostStatus(status);
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
				this.legionUpdate[2].isDriverPopup = true;
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
				this.legionUpdate[0].isDriverPopup = true;
			}
		}
	}
}
