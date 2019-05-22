import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { ModalWelcomeComponent } from './../../modal/modal-welcome/modal-welcome.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { RamOCSatus } from 'src/app/data-models/gaming/gaming-legion-edge.model';
import { isUndefined } from 'util';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';


@Component({
	selector: 'vtr-widget-legion-edge',
	templateUrl: './widget-legion-edge.component.html',
	styleUrls: ['./widget-legion-edge.component.scss']
})
export class WidgetLegionEdgeComponent implements OnInit {
  //creating object of RamOCSatus;
  public ramOCSatus_wle = new RamOCSatus();
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
			isChecked: false,
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
			isChecked: false,
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
			isChecked: false,
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
			isChecked: false,
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
			isChecked: false,
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

	constructor(private modalService: NgbModal, public systemUpdateService: SystemUpdateService, private commonService: CommonService, private gamingSystemUpdateService: GamingSystemUpdateService) { }

	ngOnInit() {
		//for cache value 
		this.getRamOverClockStatus();
		//console.log('get method ',this.getRamOverClockStatus());
		//console.log('legion update ', this.legionUpdate);
		//for using service system update
		//this.gamingSystemUpdateService.GetRAMOverClockStatus(); 
		//this.commonService.getLocalStorageValue(LocalStorageKey.RamOcStatus);
	}

	openModal() {
		//this.modalService.open(ModalWelcomeComponent);
		this.modalService.open(ModalGamingLegionedgeComponent);
	}

	//Getter 
	public getRamOverClockStatus() {
		//Useing Common Service 
		let gt_cs = this.commonService.getLocalStorageValue(LocalStorageKey.RamOcStatus);

		if (isUndefined(gt_cs)) {
			//assign the dafault value to RamOcStatus
			this.setRamOverClockStatus(false);
		}
		// setting value.
		this.ramOCSatus_wle.ramOcStatus = gt_cs;

		//Binding to UI
		if(this.legionUpdate[1].name === 'gaming.dashboard.device.legionEdge.ramOverlock') {
			this.legionUpdate[1].isChecked = this.ramOCSatus_wle.ramOcStatus;
		}
	//	this.legionUpdate[1].isChecked = this.ramOCSatus_wle.ramOcStatus;
		//console.log("ramoc status "+ this.legionUpdate[1].isChecked);
    //return this.legionUpdate[1].isChecked;
	}

	//setter
	public setRamOverClockStatus($value: boolean) {
		//Set using common service
		if (this.commonService) {
			this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, $value);
		}
	}

	public toggleOnOffRamOCStatus($event) {
		const { name, checked } = $event.target;
		//this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, false);
		//console.log('ent', $event );
		//console.log('evnt1', $event.target);
			/*if (this.legionUpdate[1].name === 'gaming.dashboard.device.legionEdge.ramOverlock' && $event.switchValue === true) {
				this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, $event.switchValue);
			} else if (this.legionUpdate[1].name !== 'gaming.dashboard.device.legionEdge.ramOverlock' && $event.switchValue === false) {
				this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, $event.switchValue);
			}*/
		//console.log(this.commonService.getLocalStorageValue(LocalStorageKey.RamOcStatus));
		if (this.legionUpdate[1].name === 'gaming.dashboard.device.legionEdge.ramOverlock' && $event.switchValue === true) {
			this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, true);
		 } else {
			this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, false);
		 }

	}

}
