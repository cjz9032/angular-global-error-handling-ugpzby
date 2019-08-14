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
	public gamingCapabilities: any = new GamingAllCapabilities();
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
			id: 'legion_edge_cpuoverlock',
			ariaLabel: 'legion_edge_cpuoverlock',
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
			id: 'legion_edge_ramoverlock',
			ariaLabel: 'legion_edge_ramoverlock',
			type: 'gaming.dashboard.device.legionEdge.ramOverlock',
			settings: ''
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
			id: 'legion_edge_autoclose',
			ariaLabel: 'legion_edge_autoclose',
			type: 'gaming.dashboard.device.legionEdge.autoClose',
			routerLink: '/autoclose',
			canNavigate: true,
			settings: 'legion_edge_autoclose_gearicon'
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
			id: 'legion_edge_networkboost',
			ariaLabel: 'legion_edge_networkboost',
			type: 'gaming.dashboard.device.legionEdge.networkBoost',
			routerLink: '/networkboost',
			canNavigate: true,
			settings: 'legion_edge_networkboost_gearicon'
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
			id: 'legion_edge_hybridmode',
			ariaLabel: 'legion_edge_hybridmode',
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
			id: 'legion_edge_touchpadlock',
			ariaLabel: 'legion_edge_touchpadlock',
			type: 'gaming.dashboard.device.legionEdge.touchpadLock',
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
				id: 'cpu_overclock_on',
				value: 1
			},
			{
				header: 'gaming.dashboard.device.legionEdge.status.whenGaming',
				name: 'gaming.dashboard.device.legionEdge.status.whenGaming',
				description: 'gaming.dashboard.device.legionEdge.statusText.gamingText',
				id: 'cpu_overclock_when_gaming',
				value: 2
			},
			{
				header: 'gaming.dashboard.device.legionEdge.status.off',
				name: 'gaming.dashboard.device.legionEdge.status.off',
				description: 'gaming.dashboard.device.legionEdge.statusText.offText',
				id: 'cpu_overclock_off',
				value: 3
			}
		]
	};
	public cpuOCStatus: CPUOCStatus = new CPUOCStatus();
	public setCpuOCStatus: any;
	public cacheMemOCFeature: boolean = false;
	public cacheHybridModeFeature: boolean = false;
	public cacheAutoCloseFeature: boolean = false;
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
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				console.log(`GAMINGCAPABILITIES in widget-legion-edge.component`, response);
				this.gamingCapabilities = response.payload;
				this.legionEdgeInit();
			}
		});
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
		this.gamingCapabilities.fbNetFilter = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.fbNetFilter
		);
		this.cacheMemOCFeature = this.commonService.getLocalStorageValue(LocalStorageKey.memOCFeatureStatus);
		this.legionUpdate[1].isChecked = this.cacheMemOCFeature;

		this.cacheHybridModeFeature = this.commonService.getLocalStorageValue(LocalStorageKey.hybridModeFeatureStatus);
		this.legionUpdate[4].isChecked = this.cacheHybridModeFeature;

		this.cacheAutoCloseFeature = this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus);
		this.legionUpdate[2].isChecked = this.cacheAutoCloseFeature;
		// Initialize Legion Edge component from cache
		this.legionEdgeInit();
	}

	legionEdgeInit() {
		const gamingStatus = this.gamingCapabilities;
		this.legionUpdate[0].isVisible = gamingStatus.cpuOCFeature;
		this.legionUpdate[1].isVisible = gamingStatus.memOCFeature;
		// TBD add autoclose later at index 2
		// TODO have to remove this || condition and line no 242.
		// this.legionUpdate[2].isVisible = gamingStatus.optimizationFeature || false;
		// this.legionUpdate[3].isVisible = gamingStatus.networkBoostFeature || false;

		// Hiding Auto close and Network boost for MVP3 Release
		this.legionUpdate[2].isVisible = false;
		this.legionUpdate[3].isVisible = false;
		//TODO below is for the network boost subpage
		this.legionUpdate[4].isVisible = gamingStatus.hybridModeFeature;
		this.legionUpdate[5].isVisible = gamingStatus.touchpadLockFeature;
		this.legionUpdate[5].isChecked = gamingStatus.touchpadLockStatus;
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
			this.renderNetworkBoostStatus();
		}
	}

	public renderAutoCloseStatus() {
		this.gamingAutoCloseService.getAutoCloseStatus().then((autoCloseModeStatus) => {
			if (autoCloseModeStatus !== undefined) {
				console.log('autoCloseModeStatus  ' + autoCloseModeStatus);
				this.autoCloseStatusObj.autoCloseStatus = autoCloseModeStatus;
				this.setAutoCloseCacheStatus(autoCloseModeStatus);
				this.legionUpdate[2].isChecked = autoCloseModeStatus;
			}
		});
	}

	public renderNetworkBoostStatus() {
		console.log('aparna  inside status');
		this.gamingNetworkBoostService.getNetworkBoostStatus().then((networkBoostModeStatus) => {
			if (networkBoostModeStatus !== undefined) {
				console.log('aparna  ' + networkBoostModeStatus);
				this.NetworkBoostStatusObj.networkBoostStatus = networkBoostModeStatus;
				this.SetNetworkBoostCacheStatus(networkBoostModeStatus);
				this.legionUpdate[3].isChecked = networkBoostModeStatus;
			}
		});
	}

	public async setAutoCloseStatus(status: any) {
		try {
			const isStatusUpdated = await this.gamingAutoCloseService.setAutoCloseStatus(status);
			if (isStatusUpdated) {
				this.setAutoCloseCacheStatus(status);
			}
		} catch (err) {
			console.log(`ERROR in AutoClose of widget-legion.component`, err);
		}
	}

	public async setNetworkBoostStatus(status: any) {
		try {
			const isStatusUpdated = await this.gamingNetworkBoostService.setNetworkBoostStatus(status);
			// TODO has to confirm with aparna to update status of cache IRR of isStatusUpdated.
			if (isStatusUpdated) {
				this.SetNetworkBoostCacheStatus(status);
			}
		} catch (err) {
			console.log(`ERROR in setNetworkBoostStatus() of widget-legion.component`, err);
		}
	}

	public getAutoCloseCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus);
	}

	public setAutoCloseCacheStatus(autoCloseStatus: boolean) {
		return this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseStatus, autoCloseStatus);
	}

	public GetNetworkBoostCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoostStatus);
	}

	public SetNetworkBoostCacheStatus(networkBoostStatus: boolean) {
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
		} catch (error) {
			console.error(error.message);
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
					console.log('setCpuOCStatus.then', value);
					if (!value) {
						this.drop.curSelected = this.GetCPUOverClockCacheStatus();
					} else {
						this.drop.curSelected = this.setCpuOCStatus.cpuOCStatus;
						this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.drop.curSelected);
					}
				})
				.catch((error) => {
					console.error('setCpuOCStatus', error);
				});
		}
	}
	openModal() {

		this.modalService.open(ModalGamingLegionedgeComponent, { windowClass: 'gaming-help-modal' });
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
			this.commonService.sendNotification(name, this.legionUpdate[1].isChecked);
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.commonService.sendNotification(name, this.legionUpdate[4].isChecked);
		}
		if (name === 'gaming.dashboard.device.legionEdge.title') {
			this.legionUpdate[0].isDriverPopup = false;
		}
	}

	public async toggleOnOffRamOCStatus($event) {
		const { name, checked } = $event.target;
		this.closeLegionEdgePopups();
		if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			if (this.gamingCapabilities.xtuService === false) {
				this.legionUpdate[1].isDriverPopup = $event;
			} else {
				this.legionUpdate[1].isPopup = $event;
			}
			this.gamingSystemUpdateService
				.setRamOCStatus($event.switchValue)
				.then((value: boolean) => {
					console.log('setRamOc.then', value);
				})
				.catch((error) => {
					console.error('setRamOcStatus', error);
				});
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.legionUpdate[4].isPopup = $event;
			this.gamingHybridModeService
				.setHybridModeStatus($event.switchValue)
				.then((value: boolean) => {
					console.log('setHybridModeStatus.then', value);
				})
				.catch((error) => {
					console.error('setHybridModeStatus', error);
				});
		}
		if (name === 'gaming.dashboard.device.legionEdge.touchpadLock') {
			this.TouchpadLockStatusObj.touchpadLockStatus = $event.switchValue;
			this.gamingKeyLockService
				.setKeyLockStatus($event.switchValue)
				.then((value: boolean) => {
					console.log('setKeyLockStatus.then', value);
					if (value) {
						this.SetTouchpadLockCacheStatus($event.switchValue);
					} else {
						this.TouchpadLockStatusObj.touchpadLockStatus = !$event.switchValue;
					}
				})
				.catch((error) => {
					console.error('setKeyLockStatus', error);
				});
		}

		if (name === 'gaming.dashboard.device.legionEdge.autoClose') {
			await this.setAutoCloseStatus($event.switchValue);
		}

		if (name === 'gaming.dashboard.device.legionEdge.networkBoost') {
			this.gamingCapabilities.fbNetFilter = !!this.gamingCapabilities.fbNetFilter;
			if (!this.gamingCapabilities.fbNetFilter) {
				this.legionUpdate[3].isDriverPopup = $event;
			} else {
				this.legionUpdate[3].isPopup = $event;
			}
			await this.setNetworkBoostStatus($event.switchValue);
		}
	}

	onIconClick(event: any) {
		event = event || { name: '' };
		const { name } = event;
		this.closeLegionEdgePopups();
		if (name === 'gaming.dashboard.device.legionEdge.networkBoost') {
			this.gamingCapabilities.fbNetFilter = !!this.gamingCapabilities.fbNetFilter;
			this.router.navigate(['/gaming/networkboost']);
			if (!this.gamingCapabilities.fbNetFilter) {
				this.legionUpdate[3].isDriverPopup = true;
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
