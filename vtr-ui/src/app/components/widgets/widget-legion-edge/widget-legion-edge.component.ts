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
	public legionUpdate = [
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.title',
			name: 'gaming.dashboard.device.legionEdge.title',
			subHeader: '',
			isVisible: true,
			isCustomizable: false,
			isCollapsible: true,
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isPopup: false,
			isChecked: false,
			tooltipText: '',
			type: 'gaming.dashboard.device.legionEdge.title',
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.ramOverlock',
			name: 'gaming.dashboard.device.legionEdge.ramOverlock',
			subHeader: '',
			isVisible: true,
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
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
			isVisible: true,
			isCustomizable: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
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
			isVisible: true,
			isCustomizable: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
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
			isVisible: true,
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
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
			isVisible: true,
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isChecked: false,
			tooltipText: '',
			type: 'gaming.dashboard.device.legionEdge.touchpadLock'
		}
	];

	public drop = {
		curSelected: 1,
		edgeopt:
			[

				{
					header: 'gaming.dashboard.device.legionEdge.status.alwayson',
					name: 'gaming.dashboard.device.legionEdge.status.alwayson',
					description: 'gaming.dashboard.device.legionEdge.statusText.onText',
					// selectedOption: false,
					// defaultOption: false,
					value: 1,
				},
				{
					header: 'gaming.dashboard.device.legionEdge.status.whenGaming',
					name: 'gaming.dashboard.device.legionEdge.status.whenGaming',
					description: 'gaming.dashboard.device.legionEdge.statusText.gamingText',
					// selectedOption: false,
					// defaultOption: true,
					value: 2,
				},
				{
					header: 'gaming.dashboard.device.legionEdge.status.off',
					name: 'gaming.dashboard.device.legionEdge.status.off',
					description: 'gaming.dashboard.device.legionEdge.statusText.offText',
					// selectedOption: false,
					// defaultOption: false,
					value: 3,
				}
			]
	}
	public cpuOCStatus: CPUOCStatus;
	private gamingCapabilities: any = {
		cpuInfoFeature: true,
		gpuInfoFeature: true,
		memoryInfoFeature: true,
		hddInfoFeature: true,
		winKeyLockFeature: true,
		touchpadLockFeature: true,
		networkBoostFeature: true,
		cpuOCFeature: true,
		ledSetFeature: false,
		memOCFeature: true,
		macroKeyFeature: false,
		hybridModeFeature: true,
		optimizationFeature: true,
		smartFanFeature: false,
		xtuService: true,
		fbnetFilter: true,
		ledDriver: false
	};

	constructor(
		private modalService: NgbModal, private ngZone: NgZone,
		private gamingSystemUpdateService: GamingSystemUpdateService,
		private gamingAllCapabilities: GamingAllCapabilitiesService,
		private commonService: CommonService,
		private gamingKeyLockService: GamingKeyLockService,
		private gamingHybridModeService: GamingHybridModeService
	) { }

	ngOnInit() {
		this.getGaminagAllCapabilities();
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
	public getGaminagAllCapabilities() {
		this.gamingAllCapabilities.getCapabilities().then((gamingCapabilities: any) => {
			console.log('gamingCapabilities js bridge ------------------------>', JSON.stringify(gamingCapabilities));
			this.legionUpdate[0].isVisible = this.gamingCapabilities.cpuOCFeature;
			this.legionUpdate[1].isVisible = this.gamingCapabilities.memOCFeature;
			this.legionUpdate[4].isVisible = this.gamingCapabilities.hybridModeFeature;
			this.legionUpdate[5].isVisible = this.gamingCapabilities.touchpadLockFeature;

		});
	}
	public renderCPUOverClockStatus() {
		try {
			// this.CpuOCStatus = this.gamingSystemUpdateService.GetCPUOverClockCacheStatus();
			// if (this.CpuOCStatus !== undefined) {
			// 	this.edgeopt.forEach((option) => {
			// 		if (option.value === this.CpuOCStatus.cpuOCStatus) {
			// 			option.selectedOption = true;
			// 			return;
			// 		}
			// 	});
			// }
			this.gamingSystemUpdateService.getCpuOCStatus().then((cpuOCStatus) => {
				console.log('get cpu oc status js bridge ---------------->', cpuOCStatus);
				if (cpuOCStatus !== undefined) {
					const CpuOCStatusObj = new CPUOCStatus();
					CpuOCStatusObj.cpuOCStatus = cpuOCStatus;
					this.drop.curSelected=CpuOCStatusObj.cpuOCStatus;

					// this.ngZone.run(() => {
					// 	this.edgeopt.forEach((option) => {
					// 		if (option.value === CpuOCStatusObj.cpuOCStatus) {
					// 			option.selectedOption = true;
					// 		}
					// 	});
					// });
				}
			});
			//	this.CpuOCStatus = this.gamingSystemUpdateService.GetCPUOverClockStatus();
			// this.ngZone.run(() => {
			// 	//this.legionUpdate[0].isChecked = this.CpuOCStatus.cpuOCStatus;
			// 	if (this.CpuOCStatus !== undefined) {
			// 		console.log('set cpu oc status in ng zone ->', this.CpuOCStatus.cpuOCStatus);
			// 		this.edgeopt.forEach((option) => {
			// 			if (option.value === this.CpuOCStatus.cpuOCStatus) {
			// 				option.selectedOption = true;
			// 				return;
			// 			}
			// 		});
			// 	}
			// });
		} catch (error) {
			console.error(error.message);
		}
	}

	onOptionSelected(event) {
		if (event.target.name === 'gaming.dashboard.device.legionEdge.title') {
			if (this.cpuOCStatus === undefined) {
				this.cpuOCStatus = new CPUOCStatus();
			}
			this.cpuOCStatus.cpuOCStatus = event.option.value;
			// this.gamingSystemUpdateService.getCpuOCStatus().then((cpuOCStatus) => {
			// 	console.log('get cpu oc status js bridge ->', cpuOCStatus);
			// 	if (cpuOCStatus !== undefined) {
			// 		const CpuOCStatusObj = new CPUOCStatus();
			// 		CpuOCStatusObj.cpuOCStatus = cpuOCStatus;

			// 	}

			// });
			//this.gamingSystemUpdateService.setCpuOCStatus(this.CpuOCStatus.cpuOCStatus);
			this.gamingSystemUpdateService
				.setCpuOCStatus(this.cpuOCStatus.cpuOCStatus)
				.then((value: boolean) => {
					console.log('setCpuOCStatus.then', value);


				})
				.catch(error => {
					console.error('setCpuOCStatus', error);
				});
		}
	}

	openModal() {
		// this.modalService.open(ModalWelcomeComponent);
		this.modalService.open(ModalGamingLegionedgeComponent, { windowClass: 'gaming-help-modal' });
	}

	public renderRamOverClockStatus() {
	//	this.RamOCSatusObj = this.GetRAMOverClockCacheStatus();

		// if (isUndefined(this.RamOCSatusObj)) {
		// 	this.RamOCSatusObj = new RamOCSatus();
		// 	this.gamingSystemUpdateService.setRamOCStatus(this.RamOCSatusObj.ramOcStatus);
		// }

		// Binding to UI
		if (this.legionUpdate[1].name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			this.gamingSystemUpdateService.getRamOCStatus().then((ramOcStatus) => {
				console.log('get ram  oc status js bridge ------------------>', ramOcStatus);
				this.legionUpdate[1].isChecked = ramOcStatus;
			});
			//this.legionUpdate[1].isChecked = this.RamOCSatusObj.ramOcStatus;

		}

		//	this.RamOCSatusObj = this.gamingSystemUpdateService.GetRAMOverClockStatus();
		// we need to rerender the component here.
	}

	public GetRAMOverClockCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.RamOcStatus);
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

	public renderHybridModeStatus() {

		// Binding to UI
		this.gamingHybridModeService.getHybridModeStatus().then((hybridModeStatus) => {
			console.log('get hybridmode status js bridge ->', hybridModeStatus);
			this.legionUpdate[4].isChecked = hybridModeStatus;
		});
		// if (this.legionUpdate[4].name === 'gaming.dashboard.device.legionEdge.hybridMode') {
		// 	this.gamingHybridModeService.getHybridModeStatus().then((hybridModeStatus) => {
		// 		console.log('get hybridmode status js bridge ->', hybridModeStatus);
		// 		this.legionUpdate[4].isChecked = hybridModeStatus;
		// 	});
		// }

	}

	public GetHybridModeCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.HybridModeStatus);
	}
	public toggleOnOffRamOCStatus($event) {
		console.log($event);
		const { name, checked } = $event.target;

		if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			this.RamOCSatusObj.ramOcStatus = $event.switchValue;
			//this.gamingSystemUpdateService.setRamOCStatus(this.RamOCSatusObj.ramOcStatus);
			this.gamingSystemUpdateService
				.setRamOCStatus(this.RamOCSatusObj.ramOcStatus)
				.then((value: boolean) => {
					console.log('setRamOCStatus.then', value);
				})
				.catch(error => {
					console.error('setRamOCStatus', error);
				});
			this.legionUpdate[1].isPopup = $event.switchValue;
		}
		else {
			this.legionUpdate[1].isPopup = false;
		}
		if (name === 'gaming.dashboard.device.legionEdge.touchpadLock') {
			this.TouchpadStatusObj.touchpadStatus = $event.switchValue;
			this.gamingKeyLockService
				.setKeyLockStatus(this.TouchpadStatusObj.touchpadStatus)
				.then((value: boolean) => {
					console.log('setKeyLockStatus.then', value);
				})
				.catch(error => {
					console.error('setKeyLockStatus', error);
				});
		}

		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			//this.HybrimodeStatusObj.hybridModeStatus = $event.switchValue;
			this.gamingHybridModeService
				.setHybridModeStatus($event.switchValue)
				.then((value: boolean) => {
					this.legionUpdate[4].isPopup = $event.switchValue;
					console.log('setHybridModeStatus.then', value);
				})
				.catch(error => {
					console.error('setHybridModeStatus', error);
				});
		} else {
			this.legionUpdate[4].isPopup = false;
		}
	}
}
