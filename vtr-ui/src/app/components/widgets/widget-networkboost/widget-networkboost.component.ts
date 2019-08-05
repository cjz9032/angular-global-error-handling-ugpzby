import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from './../../../services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAllCapabilities } from './../../../data-models/gaming/gaming-all-capabilities';
import { ModalNetworkboostComponent } from './../../modal/modal-networkboost/modal-networkboost.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-widget-networkboost',
  templateUrl: './widget-networkboost.component.html',
  styleUrls: ['./widget-networkboost.component.scss']
})
export class WidgetNetworkboostComponent implements OnInit {
  @Input() introTitle: string;
  public title: string;
  public networkBoostStatus = false;
  appsList = [];
  gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
  constructor(private modalService: NgbModal, private gamingCapabilityService: GamingAllCapabilitiesService, private networkBoostService: NetworkBoostService) { }

  ngOnInit() {
	this.title = this.introTitle;
	this.gamingProperties.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(
		LocalStorageKey.optimizationFeature
	);
	this.initNetworkBoostStatus();
	this.getNetworkBoostList();

  }


  public async initNetworkBoostStatus() {
	try {
		if (this.networkBoostService.isShellAvailable) {
		this.networkBoostStatus = await this.networkBoostService.getNetworkBoostStatus();
		}
	} catch (err) {
	console.log(`ERROR in initNetworkBoostStatus() of widget-networkboost.comp`, err);
	}
  }

  public async setNetworkBoostStatus(event: any) {
		try {
	this.networkBoostStatus = event.switchValue;
	this.networkBoostService.setNetworkBoostStatus(this.networkBoostStatus);
		} catch (err) {
		console.log(`ERROR in setNetworkBoostStatus() of widget-networkboost.comp`, err);
		}
  }

  public getNetworkBoostList() {
	try {
		this.networkBoostService.getNetworkBoostList().then((list: any) => {
		});
	} catch (error) {
		console.error(error.message);
	}
  }

  openModal(): void {
	this.modalService.open(ModalNetworkboostComponent, {
		centered: true,
		windowClass: 'autoClose-Modal'
	});
  }
  removeApp(app: any) {

  }
}
