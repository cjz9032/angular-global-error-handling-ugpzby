import { GamingAllCapabilities } from './../../../data-models/gaming/gaming-all-capabilities';
import { Component, OnInit, Input } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { isUndefined } from 'util';
import { CommonService } from 'src/app/services/common/common.service';
import { Gaming } from 'src/app/enums/gaming.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { GamingAccessoryService } from 'src/app/services/gaming/gaming-accessory/gaming-accessory.service';

@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: ['./widget-system-tools.component.scss']
})
export class WidgetSystemToolsComponent implements OnInit {
	@Input() title = '';
	showHWScanMenu: boolean = false;
	public gamingProperties: any = new GamingAllCapabilities();
	// version 3.3 for accessory entrance
	// showAccessoryEntrance = true;
	toolLength = 3;
	constructor(
		private modalService: NgbModal,
		private commonService: CommonService, 
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private hardwareScanService: HardwareScanService,
		// version 3.3 show entrance & launch accessory 
		private gamingAccessory: GamingAccessoryService,
		private logger: LoggerService

	) { }

	ngOnInit() {
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.gamingProperties = response.payload;
			}
			this.calcToolLength();
		});
		this.gamingProperties.macroKeyFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.macroKeyFeature
		);

		// if (this.hardwareScanService && this.hardwareScanService.isAvailable) {
		// 	this.hardwareScanService.isAvailable()
		// 		.then((isAvailable: any) => {
		// 			this.showHWScanMenu = isAvailable;
		// 		})
		// 		.catch(() => {
		// 			this.showHWScanMenu = false;
		// 		});
		// }

		// version 3.3 accessory entrance
		this.gamingProperties.accessoryFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.accessoryFeature
		);

		this.calcToolLength();
	}

	calcToolLength() {
		let originalLength = 3;
		if (this.gamingProperties.macroKeyFeature) {
			originalLength ++;
		}
		if (this.showHWScanMenu) {
			originalLength ++;
		}
		if( this.gamingProperties.accessoryFeature) {
			originalLength ++;
		}

		this.toolLength = originalLength;
	}

	launchAccesory() {
		try {
			this.gamingAccessory.launchAccessory().then(res => {
				this.logger.info(`Widget-SystemTools-LaunchAccesory: return value: ${res}`);
				if (!res) {
					this.openWaringModal();
				}
			})
		} catch(error) {
			this.logger.error('Widget-SystemTools-LaunchAccesory: launch fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	openWaringModal() {
		let waringModalRef = this.modalService.open(ModalGamingPromptComponent, { backdrop:'static',windowClass: 'modal-prompt' });
		waringModalRef.componentInstance.title="gaming.dashboard.device.warningPromptPopup.legionAccessory";
		waringModalRef.componentInstance.description = "gaming.dashboard.device.warningPromptPopup.accessoryDesc";
		waringModalRef.componentInstance.comfirmButton="gaming.dashboard.device.warningPromptPopup.install";
		waringModalRef.componentInstance.cancelButton="gaming.dashboard.device.legionEdge.driverPopup.link";
		waringModalRef.componentInstance.emitService.subscribe((emmitedValue) => {
			if(emmitedValue === 1) {
				window.open('https://pcsupport.lenovo.com/downloads/legionaccessorycentral');
			}
		})
	}
}
