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
import { Gaming } from 'src/app/enums/gaming.enum';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';

@Component({
	selector: 'vtr-widget-legion-edge',
	templateUrl: './widget-legion-edge.component.html',
	styleUrls: ['./widget-legion-edge.component.scss']
})
export class WidgetLegionEdgeComponent implements OnInit {
	// public ramOcStatus = false;
	public RamOCSatusObj = new RamOCSatus();
	public hybrimodeStatus = false;
	public HybrimodeStatusObj = new HybridModeStatus();
	public touchpadLockStatus: any;
	public TouchpadLockStatusObj = new TouchpadLockStatus();
	public gamingCapabilities: any = new GamingAllCapabilities();
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
			isDriverPopup: false,
			isChecked: false,
			tooltipText: '',
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
			type: 'gaming.dashboard.device.legionEdge.ramOverlock'
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
			type: 'gaming.dashboard.device.legionEdge.autoClose',
			routerLink: '/autoclose'
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
			isChecked: false,
			tooltipText: '',
			type: 'gaming.dashboard.device.legionEdge.networkBoost',
			routerLink: '/networkboost'
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
			isChecked: false,
			tooltipText: '',
			type: 'gaming.dashboard.device.legionEdge.hybridMode'
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
			type: 'gaming.dashboard.device.legionEdge.touchpadLock'
		}
	];

	public drop = {
		curSelected: 1,
		modeType: 1,
		dropOptions: [
			{
				header: 'gaming.dashboard.device.legionEdge.status.alwayson',
				name: 'gaming.dashboard.device.legionEdge.status.alwayson',
				description: 'gaming.dashboard.device.legionEdge.statusText.onText',
				// selectedOption: false,
				// defaultOption: false,
				value: 1
			},
			{
				header: 'gaming.dashboard.device.legionEdge.status.whenGaming',
				name: 'gaming.dashboard.device.legionEdge.status.whenGaming',
				description: 'gaming.dashboard.device.legionEdge.statusText.gamingText',
				// selectedOption: false,
				// defaultOption: true,
				value: 2
			},
			{
				header: 'gaming.dashboard.device.legionEdge.status.off',
				name: 'gaming.dashboard.device.legionEdge.status.off',
				description: 'gaming.dashboard.device.legionEdge.statusText.offText',
				// selectedOption: false,
				// defaultOption: false,
				value: 3
			}
		]
	};
	public cpuOCStatus: CPUOCStatus;
	public setCpuOCStatus: any;

	constructor(
		private modalService: NgbModal,
		private ngZone: NgZone,
		private gamingSystemUpdateService: GamingSystemUpdateService,
		private gamingAllCapabilities: GamingAllCapabilitiesService,
		private commonService: CommonService,
		private gamingKeyLockService: GamingKeyLockService,
		private gamingHybridModeService: GamingHybridModeService,
		private gamingCapabilityService: GamingAllCapabilitiesService
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
		this.gamingCapabilities.networkBoostFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.networkBoostFeature
		);
		this.gamingCapabilities.hybridModeFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.hybridModeFeature
		);
		this.gamingCapabilities.hybridStatus = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.HybridModeStatus
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
		// Initialize Legion Edge component from cache
		this.legionEdgeInit();
		console.log('CPU get status', this.GetCPUOverClockCacheStatus());
		this.commonService.notification.subscribe((response) => {
			if (response.type === Gaming.GamingCapablities) {
				this.gamingCapabilities = response.payload;
				this.legionEdgeInit();
			}
		});
	}

	legionEdgeInit() {
		const gamingStatus = this.gamingCapabilities;
		this.legionUpdate[0].isVisible = gamingStatus.cpuOCFeature;
		this.legionUpdate[1].isVisible = gamingStatus.memOCFeature;
		this.legionUpdate[3].isVisible = gamingStatus.networkBoostFeature;
		this.legionUpdate[4].isVisible = gamingStatus.hybridModeFeature;
		this.legionUpdate[4].isChecked = gamingStatus.hybridStatus;
		this.legionUpdate[5].isVisible = gamingStatus.touchpadLockFeature;
		this.legionUpdate[5].isChecked = gamingStatus.touchpadLockStatus;

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
	}

	public GetCPUOverClockCacheStatus(): any {
		if (this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) === undefined) {
			return this.cpuOCStatus.cpuOCStatus;
		} else {
			this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus);
		}
	}
	public renderCPUOverClockStatus() {
		try {
			this.cpuOCStatus = this.GetCPUOverClockCacheStatus();
			if (this.cpuOCStatus !== undefined) {
				this.drop.curSelected = this.cpuOCStatus.cpuOCStatus;
			}
			this.gamingSystemUpdateService.getCpuOCStatus().then((cpuOCStatus) => {
				if (cpuOCStatus !== undefined) {
					const CpuOCStatusObj = new CPUOCStatus();
					CpuOCStatusObj.cpuOCStatus = cpuOCStatus;
					this.drop.curSelected = CpuOCStatusObj.cpuOCStatus;
				}
			});
		} catch (error) {
			console.error(error.message);
		}
	}

	onOptionSelected(event) {
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
						console.log(
							//' got true from  ----- cpu oc status js bridge ->',
							this.setCpuOCStatus.cpuOCStatus
						);
						this.drop.curSelected = this.setCpuOCStatus.cpuOCStatus;
						this.commonService.setLocalStorageValue(
							LocalStorageKey.CpuOCStatus,
							this.drop.curSelected
						);
					}
				})
				.catch((error) => {
					console.error('setCpuOCStatus', error);
				});
		}
	}
	openModal() {
		// this.modalService.open(ModalWelcomeComponent);
		this.modalService.open(ModalGamingLegionedgeComponent, { windowClass: 'gaming-help-modal' });
	}
	public renderRamOverClockStatus() {
		this.gamingAllCapabilities.getCapabilities().then((gamingCapabilities: any) => {
			// console.log('xtu--->' + this.gamingCapabilities.xtuService);
			if (this.gamingCapabilities.xtuService === true) {
			this.gamingSystemUpdateService.getRamOCStatus().then((ramOcStatus) => {
					if (ramOcStatus !== undefined) {
						this.RamOCSatusObj.ramOcStatus = ramOcStatus;
						this.SetRAMOverClockCacheStatus(ramOcStatus);
						this.legionUpdate[1].isChecked = ramOcStatus;
					}
				});
			}
		});
	}
	public GetRAMOverClockCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.RamOcStatus);
	}
	public SetRAMOverClockCacheStatus(ramOcStatus: Boolean) {
		return this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, ramOcStatus);
	}


	public renderHybridModeStatus() {
		this.gamingHybridModeService.getHybridModeStatus().then((hybridModeStatus) => {
			if (hybridModeStatus !== undefined) {
				this.HybrimodeStatusObj.hybridModeStatus = hybridModeStatus;
				this.SetHybridModeCacheStatus(hybridModeStatus);
				this.legionUpdate[4].isChecked = hybridModeStatus;
			}
		});
	}

	public GetHybridModeCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.HybridModeStatus);
	}

	public SetHybridModeCacheStatus(hybridModeStatus: Boolean) {
		return this.commonService.setLocalStorageValue(LocalStorageKey.HybridModeStatus, hybridModeStatus);
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
			// console.log('touchpad Lock status from js bridge ->', touchpadLockStatus);
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

	public onPopupClosed($event) {
		const name = $event.name;
		if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			this.commonService.sendNotification(name, this.legionUpdate[1].isChecked);
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.commonService.sendNotification(name, this.legionUpdate[4].isChecked);
		}
	}

	public toggleOnOffRamOCStatus($event) {
		const { name, checked } = $event.target;
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
					if (value !== undefined) {
						this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, $event.switchValue);
						this.gamingCapabilities.RamOCSatus = !$event.switchValue;
						this.gamingAllCapabilities.getCapabilities().then((gamingCapabilities: any) => {
						});
					}
				})
				.catch((error) => {
					console.error('setRamOcStatus', error);
				});
		} else {
			// to hide the existing popup which is open(hybridmode, ramoc)
			this.legionUpdate[1].isPopup = false;
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.legionUpdate[4].isPopup = $event;
			this.gamingHybridModeService
				.setHybridModeStatus($event.switchValue)
				.then((value: boolean) => {
					console.log('setHybridModeStatus.then', value);
					if (value !== undefined) {
						this.gamingAllCapabilities.getCapabilities().then((gamingCapabilities: any) => {
						});
					}
				})
				.catch((error) => {
					console.error('setHybridModeStatus', error);
				});
		} else {
			// to hide the existing popup which is open(hybridmode, ramoc)
			this.legionUpdate[4].isPopup = false;
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
	}
}
