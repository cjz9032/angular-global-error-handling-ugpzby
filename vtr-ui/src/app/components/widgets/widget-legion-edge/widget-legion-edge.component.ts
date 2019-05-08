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
			header: 'gaming.dashboard.device.legionEdge.ramOverlock',
			name: 'gaming.dashboard.device.legionEdge.ramOverlock',
			subHeader: '',
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
			header: 'gaming.dashboard.device.legionEdge.networkBoost',
			name: 'gaming.dashboard.device.legionEdge.networkBoost',
			subHeader: '',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource:'',
			header: 'gaming.dashboard.device.legionEdge.hybridMode',
			name: 'gaming.dashboard.device.legionEdge.hybridMode',
			subHeader: '',
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
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
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
