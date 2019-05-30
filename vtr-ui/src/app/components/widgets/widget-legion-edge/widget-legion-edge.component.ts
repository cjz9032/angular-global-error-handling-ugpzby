import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RamOCSatus } from 'src/app/data-models/gaming/ram-overclock-status.model';
import { isUndefined } from 'util';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { HybridModeSatus } from 'src/app/data-models/gaming/hybrid-mode-status.model';
import { TouchpadStatus } from 'src/app/data-models/gaming/touchpad-status.model';


@Component({
	selector: 'vtr-widget-legion-edge',
	templateUrl: './widget-legion-edge.component.html',
	styleUrls: ['./widget-legion-edge.component.scss']
})
export class WidgetLegionEdgeComponent implements OnInit {

	public RamOCSatusObj = new RamOCSatus();
	public HybridModeStatusObj = new HybridModeSatus();
	public TouchpadStatusObj = new TouchpadStatus();
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

	public edgeopt = [
		{
			header: 'gaming.dashboard.device.legionEdge.status.alwayson',
			name: 'gaming.dashboard.device.legionEdge.status.alwayson',
			description: 'gaming.dashboard.device.legionEdge.statusText.onText',
			selectedOption: false,
			defaultOption: false,
			value: 1,
		},
		{
			header: 'gaming.dashboard.device.legionEdge.status.whenGaming',
			name: 'gaming.dashboard.device.legionEdge.status.whenGaming',
			description: 'gaming.dashboard.device.legionEdge.statusText.gamingText',
			selectedOption: false,
			defaultOption: true,
			value: 2,
		},
		{
			header: 'gaming.dashboard.device.legionEdge.status.off',
			name: 'gaming.dashboard.device.legionEdge.status.off',
			description: 'gaming.dashboard.device.legionEdge.statusText.offText',
			selectedOption: false,
			defaultOption: false,
			value: 3,
		}
	];
	public CpuOCStatus: CPUOCStatus;
	private gamingSettings: any = {
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
		private modalService: NgbModal,
		private gamingSystemUpdateService: GamingSystemUpdateService
	) { }

	ngOnInit() {
		this.legionUpdate[0].isVisible = this.gamingSettings.cpuOCFeature;
		this.legionUpdate[1].isVisible = this.gamingSettings.memOCFeature;
		this.legionUpdate[4].isVisible = this.gamingSettings.hybridModeFeature;
		this.legionUpdate[5].isVisible = this.gamingSettings.touchpadLockFeature;

		if (this.gamingSettings.cpuOCFeature) {
			this.renderCPUOverClockStatus();
		}

		if (this.gamingSettings.memOCFeature) {
			this.renderRamOverClockStatus();
		}

		if (this.gamingSettings.hybridModeFeature) {
			this.renderHybridModeStatus();
		}

		if (this.gamingSettings.touchpadLockFeature) {
			this.renderTouchpadStatus();
		}
	}

	public renderCPUOverClockStatus() {
		this.CpuOCStatus = this.gamingSystemUpdateService.GetCPUOverClockCacheStatus();
		if (this.CpuOCStatus !== undefined) {
			this.edgeopt.forEach((option) => {
				if (option.value === this.CpuOCStatus.cpuOCStatus) {
					option.selectedOption = true;
					return;
				}
			});
		}

		this.CpuOCStatus = this.gamingSystemUpdateService.GetCPUOverClockStatus();
	}

	onOptionSelected(event) {
		if (event.target.name === 'gaming.dashboard.device.legionEdge.title') {
			if (this.CpuOCStatus === undefined) {
				this.CpuOCStatus = new CPUOCStatus();
			}
			this.CpuOCStatus.cpuOCStatus = event.option.value;
			this.gamingSystemUpdateService.SetCPUOverClockStatus(this.CpuOCStatus);
		}
	}

	openModal() {
		// this.modalService.open(ModalWelcomeComponent);
		this.modalService.open(ModalGamingLegionedgeComponent, {windowClass: 'gaming-help-modal'});
	}

	public renderRamOverClockStatus() {
		this.RamOCSatusObj = this.gamingSystemUpdateService.GetRAMOverClockCacheStatus();

		if (isUndefined(this.RamOCSatusObj)) {
			this.RamOCSatusObj = new RamOCSatus();
			this.gamingSystemUpdateService.SetRAMOverClockStatus(this.RamOCSatusObj);
		}

		// Binding to UI
		if (this.legionUpdate[1].name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			this.legionUpdate[1].isChecked = this.RamOCSatusObj.ramOcStatus;
		}

		this.RamOCSatusObj = this.gamingSystemUpdateService.GetRAMOverClockStatus();
		// we need to rerender the component here.
	}

	public renderHybridModeStatus() {
		this.HybridModeStatusObj = this.gamingSystemUpdateService.GetHybridModeStatus();

		if (isUndefined(this.HybridModeStatusObj)) {
			this.HybridModeStatusObj = new HybridModeSatus();
			this.gamingSystemUpdateService.SetHybridModeStatus(this.HybridModeStatusObj);
		}

		// Binding to UI
		if (this.legionUpdate[4].name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.legionUpdate[4].isChecked = this.HybridModeStatusObj.hybridModeStatus;
		}
	}

	public renderTouchpadStatus() {
		this.TouchpadStatusObj = this.gamingSystemUpdateService.GetTouchpadStatus();

		if (isUndefined(this.TouchpadStatusObj)) {
			this.TouchpadStatusObj = new TouchpadStatus();
			this.gamingSystemUpdateService.SetTouchpadStatus(this.TouchpadStatusObj);
		}

		// Binding to UI
		if (this.legionUpdate[5].name === 'gaming.dashboard.device.legionEdge.touchpadLock') {
			this.legionUpdate[5].isChecked = this.TouchpadStatusObj.touchpadStatus;
		}
	}


	public toggleOnOffRamOCStatus($event) {
		console.log($event);
		const { name, checked } = $event.target;

		if (name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			this.RamOCSatusObj.ramOcStatus = $event.switchValue;
			this.gamingSystemUpdateService.SetRAMOverClockStatus(this.RamOCSatusObj);
			this.legionUpdate[1].isPopup = $event.switchValue;
		}
		else {
			this.legionUpdate[1].isPopup = false;
		}

		if (name === 'gaming.dashboard.device.legionEdge.hybridMode') {
			this.HybridModeStatusObj.hybridModeStatus = $event.switchValue;
			this.gamingSystemUpdateService.SetHybridModeStatus(this.HybridModeStatusObj);
			this.legionUpdate[4].isPopup = $event.switchValue;
		}
		else {
			this.legionUpdate[4].isPopup = false
		}

		if (name === 'gaming.dashboard.device.legionEdge.touchpadLock') {
			this.TouchpadStatusObj.touchpadStatus = $event.switchValue;
			this.gamingSystemUpdateService.SetTouchpadStatus(this.TouchpadStatusObj); 
			//this.legionUpdate[4].isPopup = $event.switchValue;
		}
		
		if (name === 'gaming.dashboard.device.legionEdge.hybridMode' && $event.switchValue === true) {
			this.legionUpdate[4].isPopup = true;
		} else {
			this.legionUpdate[4].isPopup = false;
		}
	}
}
