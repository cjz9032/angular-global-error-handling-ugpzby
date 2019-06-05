import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { Component, OnInit, NgZone } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RamOCSatus } from 'src/app/data-models/gaming/ram-overclock-status.model';
import { isUndefined } from 'util';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { HybridModeStatus } from 'src/app/data-models/gaming/hybrid-mode-status.model';
import { TouchpadStatus } from 'src/app/data-models/gaming/touchpad-status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingKeyLockService } from 'src/app/services/gaming/gaming-keylock/gaming-key-lock.service';
import { GamingHybridModeService } from 'src/app/services/gaming/gaming-hybrid-mode/gaming-hybrid-mode.service';
import { Gaming } from 'src/app/enums/gaming.enum';

@Component({
	selector: 'vtr-widget-legion-edge',
	templateUrl: './widget-legion-edge.component.html',
	styleUrls: ['./widget-legion-edge.component.scss']
})
export class WidgetLegionEdgeComponent implements OnInit {
	public ramOcStatus = false;
	public RamOCSatusObj = new RamOCSatus();
	public touchpadStatus = false;
	public TouchpadStatusObj = new TouchpadStatus();
	public hybrimodeStatus = false;
	public HybrimodeStatusObj = new HybridModeStatus();
	public gamingCapabilities: any;
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
			isChecked: false,
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
	// private gamingCapabilities: any = {
	// 	cpuInfoFeature: true,
	// 	gpuInfoFeature: true,
	// 	memoryInfoFeature: true,
	// 	hddInfoFeature: true,
	// 	winKeyLockFeature: true,
	// 	touchpadLockFeature: true,
	// 	networkBoostFeature: true,
	// 	cpuOCFeature: true,
	// 	ledSetFeature: false,
	// 	memOCFeature: true,
	// 	macroKeyFeature: false,
	// 	hybridModeFeature: true,
	// 	optimizationFeature: true,
	// 	smartFanFeature: false,
	// 	xtuService: false,
	// 	fbnetFilter: true,
	// 	ledDriver: false
	// };

	constructor(
		private modalService: NgbModal,
		private ngZone: NgZone,
		private gamingSystemUpdateService: GamingSystemUpdateService,
		private gamingAllCapabilities: GamingAllCapabilitiesService,
		private commonService: CommonService,
		private gamingKeyLockService: GamingKeyLockService,
		private gamingHybridModeService: GamingHybridModeService
	) { }
	ngAfterViewInit(): void { }
	ngOnInit() {
		this.commonService.notification.subscribe((response) => {
			if (response.type === Gaming.GamingCapablities && isUndefined(this.gamingCapabilities)) {
				this.gamingCapabilities = response.payload;
				console.log('get gamingCapabilities --------------------------------->', this.gamingCapabilities);
				this.legionUpdate[0].isVisible = this.gamingCapabilities.cpuOCFeature;
				this.legionUpdate[1].isVisible = this.gamingCapabilities.memOCFeature;
				this.legionUpdate[2].isVisible = this.gamingCapabilities.autoClose;
				this.legionUpdate[3].isVisible = this.gamingCapabilities.networkBoostFeature;
				this.legionUpdate[4].isVisible = this.gamingCapabilities.hybridModeFeature;
				this.legionUpdate[5].isVisible = this.gamingCapabilities.touchpadLockFeature;

				if (this.gamingCapabilities.cpuOCFeature) {
					this.renderCPUOverClockStatus();
				}

				if (this.gamingCapabilities.memOCFeature) {
					this.renderRamOverClockStatus();
				}

				if (this.gamingCapabilities.touchpadLockFeature) {
					this.renderTouchpadStatus();
				}

				if (this.gamingCapabilities.hybridModeFeature) {
					this.renderHybridModeStatus();
				}
			}
		});
	}

	public GetCPUOverClockCacheStatus(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus);
	}
	public renderCPUOverClockStatus() {
		try {
			this.cpuOCStatus = this.GetCPUOverClockCacheStatus();
			if (this.cpuOCStatus !== undefined) {
				this.drop.curSelected = this.cpuOCStatus.cpuOCStatus;
			}
			this.gamingSystemUpdateService.getCpuOCStatus().then((cpuOCStatus) => {
				console.log('get cpu oc status js bridge ---------------->', cpuOCStatus);
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
							' got true from  ----- cpu oc status js bridge ->',
							this.setCpuOCStatus.cpuOCStatus
						);
						this.drop.curSelected = this.setCpuOCStatus.cpuOCStatus;
						this.commonService.setLocalStorageValue(
							LocalStorageKey.CpuOCStatus,
							this.cpuOCStatus.cpuOCStatus
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
			console.log('xtu--->' + this.gamingCapabilities.xtuService);
			if (this.gamingCapabilities.xtuService === true) {
				if (this.commonService) {
					this.legionUpdate[1].isChecked = this.GetRAMOverClockCacheStatus();
				}
				this.gamingSystemUpdateService.getRamOCStatus().then((ramOcStatus) => {
					console.log('get RAMOC status js bridge -->', ramOcStatus);
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
	public SetRAMOverClockCacheStatus(ramOcStatus) {
		return this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, ramOcStatus);
	}
	public renderHybridModeStatus() {
		this.gamingAllCapabilities.getCapabilities().then((gamingCapabilities: any) => {
			console.log('xtu --->' + this.gamingCapabilities.xtuService);
			if (this.gamingCapabilities.xtuService === true) {
				if (this.commonService) {
					this.legionUpdate[4].isChecked = this.GetHybridModeCacheStatus();
				}
				this.gamingHybridModeService.getHybridModeStatus().then((hybridModeStatus) => {
					console.log('get Hybrid Mode status js bridge -->', hybridModeStatus);
					if (hybridModeStatus !== undefined) {
						this.SetHybridModeCacheStatus(hybridModeStatus);
						this.legionUpdate[4].isChecked = hybridModeStatus;
					}
				});
			}
		});
	}
	public GetHybridModeCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.HybridModeStatus);
	}

	public SetHybridModeCacheStatus(hybridModeStatus) {
		return this.commonService.setLocalStorageValue(LocalStorageKey.HybridModeStatus, hybridModeStatus);
	}
	public renderTouchpadStatus() {
		// Binding to UI
		this.gamingKeyLockService.getKeyLockStatus().then((touchpadOCStatus) => {
			console.log('get touchpad status js bridge ->', touchpadOCStatus);
			this.legionUpdate[5].isChecked = touchpadOCStatus;
		});
		// if (this.legionUpdate[5].name === 'gaming.dashboard.device.legionEdge.touchpadLock') {
		// 	this.gamingKeyLockService.getKeyLockStatus().then((touchpadOCStatus) => {
		// 		console.log('get touchpad status js bridge ->', touchpadOCStatus);
		// 		this.legionUpdate[5].isChecked = touchpadOCStatus;
		// 	});
		// }
	}
	public GetTouchpadCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.TouchpadStatus);
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
		console.log($event);
		const { name, checked } = $event.target;
		if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			this.gamingSystemUpdateService
				.setRamOCStatus($event.switchValue)
				.then((value: boolean) => {
					console.log('setRamOc.then', value);
					if (value !== undefined) {
						this.gamingAllCapabilities.getCapabilities().then((gamingCapabilities: any) => {
							//console.log('XTU Service---> ' + this.gamingCapabilities.xtuService);
							//this.gamingCapabilities.xtuService = false ;
							if (this.gamingCapabilities.xtuService === false) {
								this.legionUpdate[1].isDriverPopup = $event;
							} else if (this.gamingCapabilities.xtuService === true) {
								this.legionUpdate[1].isPopup = $event;
							}
							this.commonService.setLocalStorageValue(
								LocalStorageKey.RamOcStatus,
								$event.switchValue
							);
						});
					}
				})
				.catch((error) => {
					console.error('setRamOcStatus', error);
				});
		} else {
			//to hide the existing popup which is open(hybridmode, ramoc)
			this.legionUpdate[1].isPopup = false;
		}
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.gamingHybridModeService
				.setHybridModeStatus($event.switchValue)
				.then((value: boolean) => {
					console.log('setHybridModeStatus.then', value);
					if (value !== undefined) {
						this.gamingAllCapabilities.getCapabilities().then((gamingCapabilities: any) => {
							//console.log('XTU Service---> ' + this.gamingCapabilities.xtuService);
							//this.gamingCapabilities.xtuService = false;
							if (this.gamingCapabilities.xtuService === true) {
								this.legionUpdate[4].isPopup = $event;
							} else if (this.gamingCapabilities.xtuService === false) {
								this.legionUpdate[4].isDriverPopup = $event;
							}
							this.commonService.setLocalStorageValue(
								LocalStorageKey.HybridModeStatus,
								$event.switchValue
							);
						});
					}
				})
				.catch((error) => {
					console.error('setHybridModeStatus', error);
				});
		} else {
			//to hide the existing popup which is open(hybridmode, ramoc)
			this.legionUpdate[4].isPopup = false;
		}

		if (name === 'gaming.dashboard.device.legionEdge.touchpadLock') {
			this.TouchpadStatusObj.touchpadStatus = $event.switchValue;
			this.gamingKeyLockService
				.setKeyLockStatus(this.TouchpadStatusObj.touchpadStatus)
				.then((value: boolean) => {
					console.log('setKeyLockStatus.then', value);
				})
				.catch((error) => {
					console.error('setKeyLockStatus', error);
				});
		}
	}
}
