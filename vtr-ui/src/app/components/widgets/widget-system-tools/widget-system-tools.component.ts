import { Subscription } from 'rxjs/internal/Subscription';
import { GamingAllCapabilities } from './../../../data-models/gaming/gaming-all-capabilities';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { isUndefined } from 'util';
import { CommonService } from 'src/app/services/common/common.service';
import { Gaming } from 'src/app/enums/gaming.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { GamingAccessoryService } from 'src/app/services/gaming/gaming-accessory/gaming-accessory.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: ['./widget-system-tools.component.scss']
})
export class WidgetSystemToolsComponent implements OnInit, OnDestroy {
	@Input() title = '';
	public showHWScanMenu: boolean = false;
	public gamingProperties: any = new GamingAllCapabilities();
	// version 3.3 for accessory entrance
	public showLegionAccessory: boolean = false;
	public toolLength: number = 3;
	private notificationSubscription: Subscription;
	private eventEmitSubscription: Subscription;

	modalAutomationId: any = {
		section: 'legion_accessory_central_install_popup',
		closeButton : 'legion_accessory_close_button',
		cancelButton: 'legion_accessory_central_install_popup_cancel_button',
		okButton: 'legion_accessory_central_install_popup_install_button'
	}
	constructor(
		private modalService: NgbModal,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private hardwareScanService: HardwareScanService,
		// version 3.3 show entrance & launch accessory
		private gamingAccessoryService: GamingAccessoryService,
		private logger: LoggerService

	) { }

	ngOnInit() {
		this.notificationSubscription = this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.gamingProperties = response.payload;
			}
			this.calcToolLength();
		});
		this.gamingProperties.macroKeyFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.macroKeyFeature
		);
		// version 3.3 legion accessory cache
		this.showLegionAccessory = this.localCacheService.getLocalCacheValue(LocalStorageKey.accessoryFeature);
		this.showHWScanMenu = this.localCacheService.getLocalCacheValue(LocalStorageKey.hardwareScanFeature);
		this.calcToolLength();

		if (this.hardwareScanService && this.hardwareScanService.isAvailable) {
			this.hardwareScanService.isAvailable()
				.then((response: any) => {
					if(response !== this.showHWScanMenu && response !== undefined) {
						this.showHWScanMenu = response;
						this.localCacheService.setLocalCacheValue(LocalStorageKey.hardwareScanFeature, response);
						this.calcToolLength();
					}
				})
				.catch(() => {
					this.showHWScanMenu = false;
				});
		}

		// version 3.3 legion accessory get reg status
		this.gamingAccessoryService.isLACSupportUriProtocol().then(res => {
			if(res !== this.showLegionAccessory && res !== undefined) {
				this.showLegionAccessory = res;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.accessoryFeature, res);
				this.calcToolLength();
			}
		});
	}

	ngOnDestroy() {
		if(this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if(this.eventEmitSubscription) {
			this.eventEmitSubscription.unsubscribe();
		}
	}

	calcToolLength() {
		let originalLength = 3;
		if (this.gamingProperties.macroKeyFeature) {
			originalLength ++;
		}
		if (this.showHWScanMenu) {
			originalLength ++;
		}
		if( this.showLegionAccessory) {
			originalLength ++;
		}

		this.toolLength = originalLength;
	}

	launchAccessory() {
		try {
			this.gamingAccessoryService.isLACSupportUriProtocol().then(res => this.gamingAccessoryService.launchAccessory(res)).then(res => {
				this.logger.info(`Widget-SystemTools-LaunchAccessory: return value: ${res}`);
				if (!res && res === undefined) {
					this.openWaringModal();
				}
			})
		} catch(error) {
			this.logger.error('Widget-SystemTools-LaunchAccessory: launch fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	openWaringModal() {
		let waringModalRef = this.modalService.open(ModalGamingPromptComponent, { backdrop:'static',windowClass: 'modal-prompt' });
		waringModalRef.componentInstance.info= {
			title: "gaming.dashboard.device.warningPromptPopup.legionAccessory",
			description: "gaming.dashboard.device.warningPromptPopup.accessoryDesc",
			comfirmButton: "gaming.dashboard.device.legionEdge.driverPopup.button",
			cancelButton: "gaming.dashboard.device.legionEdge.driverPopup.link",
			id : this.modalAutomationId
		}
		this.eventEmitSubscription = waringModalRef.componentInstance.emitService.subscribe((emmitedValue) => {
			if(emmitedValue === 1) {
				window.open('https://pcsupport.lenovo.com/downloads/legionaccessorycentral');
			}
		})
	}
}
