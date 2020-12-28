import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAllCapabilities } from './../../../data-models/gaming/gaming-all-capabilities';
import { Gaming } from 'src/app/enums/gaming.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { GamingThirdPartyAppService } from 'src/app/services/gaming/gaming-third-party-app/gaming-third-party-app.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: ['./widget-system-tools.component.scss'],
})
export class WidgetSystemToolsComponent implements OnInit, OnDestroy {
	@Input() title = '';
	public showHWScanMenu = false;
	public gamingProperties: any = new GamingAllCapabilities();
	// version 3.3 for accessory entrance
	public showLegionAccessory = false;
	// Vsrsion 3.5 for nahimic & X-Rite entrance
	public showNahimic = false;
	public showXRite = false;
	public toolLength = 3;

	modalAutomationId: any = {
		accessory: {
			section: 'legion_accessory_central_install_popup',
			closeButton: 'legion_accessory_close_button',
			cancelButton: 'legion_accessory_central_install_popup_cancel_button',
			okButton: 'legion_accessory_central_install_popup_install_button',
		},
		nahimic: {
			section: 'nahimic_install_popup',
			closeButton: 'nahimic_close_button',
			cancelButton: 'nahimic_install_popup_cancel_button',
			okButton: 'nahimic_install_popup_install_button',
		},
		xRite: {
			section: 'xRite_install_popup',
			closeButton: 'xRite_close_button',
			cancelButton: 'xRite_install_popup_cancel_button',
			okButton: 'xRite_install_popup_install_button',
		}
	};
	modalInfo = {
		accessory: {
			title: 'gaming.dashboard.device.warningPromptPopup.legionAccessory',
			description: 'gaming.dashboard.device.warningPromptPopup.accessoryDesc',
			comfirmButton: 'gaming.dashboard.device.legionEdge.driverPopup.button',
			cancelButton: 'gaming.dashboard.device.legionEdge.driverPopup.link',
			confirmMetricEnabled: false,
			cancelMetricEnabled: false,
			id: this.modalAutomationId.accessory,
			webLink: 'https://pcsupport.lenovo.com/downloads/legionaccessorycentral'
		},
		nahimic: {
			title: 'Nahimic',
			description: 'Nahimic is a media software',
			comfirmButton: 'gaming.dashboard.device.legionEdge.driverPopup.button',
			cancelButton: 'gaming.dashboard.device.legionEdge.driverPopup.link',
			confirmMetricEnabled: false,
			cancelMetricEnabled: false,
			id: this.modalAutomationId.nahimic,
			webLink: 'https://www.microsoft.com/store/apps/9N36PPMP8S23'
		},
		xRite: {
			title: 'X-Rite Color Assistant',
			description: 'This app enables you to choose and apply factory calibrated color profiles.',
			comfirmButton: 'gaming.dashboard.device.legionEdge.driverPopup.button',
			cancelButton: 'gaming.dashboard.device.legionEdge.driverPopup.link',
			confirmMetricEnabled: false,
			cancelMetricEnabled: false,
			id: this.modalAutomationId.xRite,
			webLink: 'https://pcsupport.lenovo.com/us/en/downloads/DS543953'
		}
	};

	private notificationSubscription: Subscription;
	private eventEmitSubscription: Subscription;
	constructor(
		private modalService: NgbModal,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private hardwareScanService: HardwareScanService,
		// version 3.3 show entrance & launch accessory
		private gamingThirdPartyAppService: GamingThirdPartyAppService,
		private logger: LoggerService
	) {}

	ngOnInit() {
		this.notificationSubscription = this.commonService
			.getCapabalitiesNotification()
			.subscribe((response) => {
				if (response.type === Gaming.GamingCapabilities) {
					this.gamingProperties = response.payload;
				}
				this.calcToolLength();
			});
		this.gamingProperties.macroKeyFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.macroKeyFeature
		);
		this.showHWScanMenu = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.hardwareScanFeature
		);
		// version 3.3 legion accessory cache
		this.showLegionAccessory = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.accessoryFeature
		);
		this.showNahimic = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.nahimicFeature
		);
		this.showXRite = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.xRiteFeature
		);
		this.calcToolLength();

		if (this.hardwareScanService && this.hardwareScanService.isAvailable) {
			this.hardwareScanService
				.isAvailable()
				.then((response: any) => {
					if (response !== this.showHWScanMenu && response !== undefined) {
						this.showHWScanMenu = response;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.hardwareScanFeature,
							response
						);
						this.calcToolLength();
					}
				})
				.catch(() => {
					this.showHWScanMenu = false;
				});
		}

		// version 3.3 legion accessory get reg status
		this.gamingThirdPartyAppService.isLACSupportUriProtocol('accessory').then((res) => {
			if (res !== this.showLegionAccessory && res !== undefined) {
				this.showLegionAccessory = res;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.accessoryFeature, res);
				this.calcToolLength();
			}
		});
		// Version 3.5 nahimic get reg status
		this.gamingThirdPartyAppService.isLACSupportUriProtocol('nahimic').then((res) => {
			if (res !== this.showNahimic && res !== undefined) {
				this.showNahimic = res;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.nahimicFeature, res);
				this.calcToolLength();
			}
		});
		// Version 3.5 xRite get reg status
		this.gamingThirdPartyAppService.isLACSupportUriProtocol('xRite').then((res) => {
			if (res !== this.showXRite && res !== undefined) {
				this.showXRite = res;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.xRiteFeature, res);
				this.calcToolLength();
			}
		});
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.eventEmitSubscription) {
			this.eventEmitSubscription.unsubscribe();
		}
	}

	calcToolLength() {
		let originalLength = 3;
		if (this.gamingProperties.macroKeyFeature) {
			originalLength++;
		}
		if (this.showHWScanMenu) {
			originalLength++;
		}
		if (this.showLegionAccessory) {
			originalLength++;
		}
		if(this.showNahimic) {
			originalLength++;
		}
		if(this.showXRite) {
			originalLength++
		}

		this.toolLength = originalLength;
	}

	launchThirdPartyApp(key: string) {
		try {
			this.gamingThirdPartyAppService
				.isLACSupportUriProtocol(key)
				.then((res) => this.gamingThirdPartyAppService.launchThirdPartyApp(res, key))
				.then((res) => {
					this.logger.info(`Widget-SystemTools-LaunchAccessory: return value: ${res}`);
					if (!res && res === undefined) {
						this.openWaringModal(key);
					}
				});
		} catch (error) {
			this.logger.error(
				'Widget-SystemTools-LaunchAccessory: launch fail; Error message: ',
				error.message
			);
			throw new Error(error.message);
		}
	}

	openWaringModal(key: string) {
		const waringModalRef = this.modalService.open(ModalGamingPromptComponent, {
			backdrop: 'static',
			windowClass: 'modal-prompt',
		});
		waringModalRef.componentInstance.info = {
			title: this.modalInfo[key].title,
			description: this.modalInfo[key].description,
			comfirmButton: this.modalInfo[key].comfirmButton,
			cancelButton: this.modalInfo[key].cancelButton,
			confirmMetricEnabled: this.modalInfo[key].confirmMetricEnabled,
			cancelMetricEnabled: this.modalInfo[key].cancelMetricEnabled,
			id: this.modalInfo[key].id,
		};
		this.eventEmitSubscription = waringModalRef.componentInstance.emitService.subscribe(
			(emmitedValue) => {
				if (emmitedValue === 1) {
					window.open(this.modalInfo[key].webLink);
				}
			}
		);
	}
}
