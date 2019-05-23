import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';

@Component({
	selector: 'vtr-widget-legion-edge',
	templateUrl: './widget-legion-edge.component.html',
	styleUrls: ['./widget-legion-edge.component.scss']
})
export class WidgetLegionEdgeComponent implements OnInit {

	public legionUpdate = [
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.title',
			name: 'gaming.dashboard.device.legionEdge.title',
			subHeader: '',
			isCustomizable: false,
			isCollapsible: true,
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isPopup: false,
			isChecked: false,
			tooltipText: '',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.ramOverlock',
			name: 'gaming.dashboard.device.legionEdge.ramOverlock',
			subHeader: '',
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: true,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.autoClose',
			name: 'gaming.dashboard.device.legionEdge.autoClose',
			subHeader: '',
			isCustomizable: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates',
			routerLink: '/autoclose'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.networkBoost',
			name: 'gaming.dashboard.device.legionEdge.networkBoost',
			subHeader: '',
			isCustomizable: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates',
			routerLink: '/networkboost'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.hybridMode',
			name: 'gaming.dashboard.device.legionEdge.hybridMode',
			subHeader: '',
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: true,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
		}
		,
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.legionEdge.touchpadLock',
			name: 'gaming.dashboard.device.legionEdge.touchpadLock',
			subHeader: '',
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isPopup: false,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
		}
	];

	public edgeopt = [
		{
			header: 'gaming.dashboard.device.legionEdge.status.alwayson',
			name: 'gaming.dashboard.device.legionEdge.status.alwayson',
			description: 'gaming.dashboard.device.legionEdge.status.alwayson',
			selectedOption: false,
			defaultOption: false,
			value: 1,
		},
		{
			header: 'gaming.dashboard.device.legionEdge.status.whenGaming',
			name: 'gaming.dashboard.device.legionEdge.status.whenGaming',
			description: 'gaming.dashboard.device.legionEdge.status.whenGaming',
			selectedOption: false,
			defaultOption: true,
			value: 2,
		},
		{
			header: 'gaming.dashboard.device.legionEdge.status.off',
			name: 'gaming.dashboard.device.legionEdge.status.off',
			description: 'gaming.dashboard.device.legionEdge.status.off',
			selectedOption: false,
			defaultOption: false,
			value: 3,
		}
	];
	public CpuOCStatus: CPUOCStatus;

	constructor(
		private modalService: NgbModal,
		private gamingSystemUpdateService: GamingSystemUpdateService,
	) { }

	ngOnInit() {
		this.CpuOCStatus = this.gamingSystemUpdateService.GetCPUOverClockStatus();
		if (this.CpuOCStatus !== undefined) {
			this.edgeopt.forEach((option) => {
				if (option.value === this.CpuOCStatus.cpuOCStatus) {
					option.selectedOption = true;
					return;
				}
			});
		}
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
		//this.modalService.open(ModalWelcomeComponent);
		this.modalService.open(ModalGamingLegionedgeComponent,{windowClass: 'gaming-help-modal'});
	}

}
