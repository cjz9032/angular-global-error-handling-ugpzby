import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { ModalWelcomeComponent } from './../../modal/modal-welcome/modal-welcome.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates',
			routerLink:'/autoclose'
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
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates',
			routerLink:'/networkboost'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource:'',
			header: 'gaming.dashboard.device.legionEdge.hybridMode',
			name: 'gaming.dashboard.device.legionEdge.hybridMode',
			subHeader: '',
			isCustomizable: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
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
			defaultOption: false,
			value: 1,
		},
		{
			header: 'gaming.dashboard.device.legionEdge.status.whenGaming',
			name: 'gaming.dashboard.device.legionEdge.status.whenGaming',
			description: 'gaming.dashboard.device.legionEdge.status.whenGaming',
			defaultOption: false,
			value: 2,
		},
		{
			header: 'gaming.dashboard.device.legionEdge.status.off',
			name: 'gaming.dashboard.device.legionEdge.status.off',
			description: 'gaming.dashboard.device.legionEdge.status.off',
			defaultOption: true,
			value: 3,
		}
	];

	constructor(private modalService: NgbModal) { }

	ngOnInit() {
	}

	openModal() {
		//this.modalService.open(ModalWelcomeComponent);
		this.modalService.open(ModalGamingLegionedgeComponent);
	}

}
