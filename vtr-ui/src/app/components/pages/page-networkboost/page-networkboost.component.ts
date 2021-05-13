import { Subscription } from 'rxjs/internal/Subscription';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppNotification } from './../../../data-models/common/app-notification.model';
import { CommonService } from './../../../services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { GamingQuickSettingToolbarService } from 'src/app/services/gaming/gaming-quick-setting-toolbar/gaming-quick-setting-toolbar.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { ModalGamingRunningAppListComponent } from './../../modal/modal-gaming-running-app-list/modal-gaming-running-app-list.component';
import { GAMING_DATA } from './../../../../testing/gaming-data';
import { MatDialog } from '@lenovo/material/dialog';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import {  Router } from '@angular/router';

@Component({
	selector: 'vtr-page-networkboost',
	templateUrl: './page-networkboost.component.html',
	styleUrls: ['./page-networkboost.component.scss'],
})
export class PageNetworkboostComponent implements OnInit, OnDestroy {
	public networkBoostEvent: any;
	refreshTrigger = 0;
	appsCount = 0;
	toggleStatus: boolean =
		this.localCacheService.getLocalCacheValue(LocalStorageKey.NetworkBoostStatus) || false;
	needToAsk: any;
	autoCloseStatusObj: any = {};
	needToAskStatusObj: any = {};
	isOnline = true;
	// CMS Content block
	cardContentPositionC: any = {};
	cardContentPositionF: any = {};
	dynamicMetricsItem: any = 'networkboost_cms_inner_content';
	backId = 'vtr-gaming-networkboost-btn-back';
	notificationSubscrition: Subscription;
	fetchSubscrition: Subscription;
	fetchCacheSubscrition: Subscription;

	isModalShowing: boolean;

	modalAutomationId: any = {
		section: 'nbTurnOnModal',
		headerText: 'network_boost_turn_on_popup_header_text',
		description: 'network_boost_turn_on_popup_description',
		dontAskCheckbox: 'networkboost_turnon_dialog_checkbox_Dont_ask_again',
		closeButton: 'nbTurnOnModal_closeButton',
		cancelButton: 'nbTurnOnModal_notnow',
		okButton: 'nbTurnOnModal_turnon_button',
	};

	constructor(
		private cmsService: CMSService,
		private networkBoostService: NetworkBoostService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private loggerService: LoggerService,
		private shellServices: VantageShellService,
		private gamingQuickSettingToolbarService: GamingQuickSettingToolbarService,
		private ngZone: NgZone,
		private dialog: MatDialog,
		private gamingAllCapabilitiesService: GamingAllCapabilitiesService,
		private router: Router
	) {
		this.fetchCMSArticles();
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.checkGamingCapabilities();
		this.notificationSubscrition = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
		this.isModalShowing = false;
		// AutoClose Init
		this.getNetworkBoostStatus();
		this.networkBoostRegisterEvent();
		const queryOptions = GAMING_DATA.buildPage('network-boost');

		this.fetchCacheSubscrition = this.cmsService
			.fetchCMSContent(queryOptions)
			.subscribe((response: any) => {
				const cardContentPositionF = this.cmsService.getOneCMSContent(
					response,
					'half-width-top-image-title-link',
					'position-F'
				)[0];
				if (cardContentPositionF) {
					this.cardContentPositionF = cardContentPositionF;
				}

				const cardContentPositionC = this.cmsService.getOneCMSContent(
					response,
					'half-width-title-description-link-image',
					'position-C'
				)[0];
				if (cardContentPositionC) {
					this.cardContentPositionC = cardContentPositionC;
					if (this.cardContentPositionC.BrandName) {
						this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split(
							'|'
						)[0];
					}
				}
			});
	}

	ngOnDestroy() {
		if (this.notificationSubscrition) {
			this.notificationSubscrition.unsubscribe();
		}

		if (this.fetchCacheSubscrition) {
			this.fetchCacheSubscrition.unsubscribe();
		}

		if (this.fetchSubscrition) {
			this.fetchSubscrition.unsubscribe();
		}

		this.networkBoostUnRegisterEvent();
	}

	async openTargetModal() {
		if (this.isModalShowing === true) {
			return;
		}
		this.isModalShowing = true;
		try {
			this.needToAsk = this.getNotAskAgain();
			if (
				this.toggleStatus ||
				this.needToAsk === 1 ||
				this.needToAsk === 2 ||
				this.needToAsk === true
			) {
				this.showAddApps();
			} else {
				this.showTurnOn();
			}
		} catch (error) {
			this.loggerService.error(
				'page-networkboost.component.openTargetModal',
				'ERROR in openTargetModal()-->' + error
			);
		}
	}

	showTurnOn() {
		const promptRef = this.dialog.open(ModalGamingPromptComponent, {
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'modal-prompt',
			backdropClass: 'backdrop-level',
		});
		promptRef.componentInstance.info = {
			title: 'gaming.networkBoost.modalTurn.title',
			description: 'gaming.networkBoost.modalTurn.body',
			comfirmButton: 'gaming.autoClose.modalTurnAutoClose.btnConfirm',
			comfirmButtonAriaLabel: 'gaming.narrator.networkBoost.turnOnModal.turnOnButton',
			cancelButton: 'gaming.autoClose.modalTurnAutoClose.btnCancel',
			cancelButtonAriaLabel: 'gaming.narrator.networkBoost.turnOnModal.notOnButton',
			checkboxTitle: 'gaming.networkBoost.modalTurn.checkedTitle',
			dontAskNarrator: 'gaming.narrator.networkBoost.turnOnModal.dontAskAgain',
			confirmMetricEnabled: true,
			confirmMetricsItemId: 'networkboost_turn_on_button',
			cancelMetricEnabled: false,
			cancelMetricsItemId: '',
			id: this.modalAutomationId,
		};
		promptRef.componentInstance.emitService.subscribe((emmitedValue) => {
			if (emmitedValue === true || emmitedValue === false) {
				this.needToAsk = emmitedValue;
				this.setNotAskAgain(this.needToAsk);
			} else if (emmitedValue === 1) {
				// Turn on Network Boost
				this.setNetworkBoostStatus({ switchValue: true });
			}
		});
		promptRef.afterClosed().subscribe(() => {
			// Finally, open Add App Model
			this.showAddApps();
		});
	}

	showAddApps() {
		const appListRef = this.dialog.open(ModalGamingRunningAppListComponent, {
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			backdropClass: 'backdrop-level',
		});
		appListRef.componentInstance.setAppList(true, this.appsCount);
		appListRef.afterClosed().subscribe(() => {
			this.refreshTrigger += 1;
			this.isModalShowing = false;
		});
	}

	onNotification(notification: AppNotification) {
		if (
			notification &&
			(notification.type === NetworkStatus.Offline ||
				notification.type === NetworkStatus.Online)
		) {
			this.isOnline = notification.payload.isOnline;
			this.fetchCMSArticles();
		}
		if (this.isOnline === undefined) {
			this.isOnline = true;
		}
	}

	async setNetworkBoostStatus(event: any) {
		try {
			this.toggleStatus = event.switchValue;
			await this.networkBoostService.setNetworkBoostStatus(event.switchValue);
			if (!this.toggleStatus) {
				if (
					this.localCacheService.getLocalCacheValue(
						LocalStorageKey.NetworkBoosNeedToAskPopup
					) === 2
				) {
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.NetworkBoosNeedToAskPopup,
						1
					);
				}
			}
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.NetworkBoostStatus,
				this.toggleStatus
			);
		} catch (err) {
			this.loggerService.error(
				'page-networkboost.component.setNetworkBoostStatus',
				'ERROR in setNetworkBoostStatus()-->' + err
			);
		}
	}

	getNotAskAgain() {
		let notAskAgain = this.networkBoostService.getNeedToAsk();
		notAskAgain = notAskAgain === undefined || isNaN(notAskAgain) ? false : notAskAgain;
		return notAskAgain;
	}

	setNotAskAgain(status: boolean) {
		try {
			this.networkBoostService.setNeedToAsk(status);
		} catch (error) {
			this.loggerService.error(
				'page-networkboost.component.setAksAgain',
				'ERROR in setAksAgain()-->' + error
			);
		}
	}

	async getNetworkBoostStatus() {
		try {
			this.toggleStatus = await this.networkBoostService.getNetworkBoostStatus();
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.NetworkBoostStatus,
				this.toggleStatus
			);
		} catch (err) {
			this.loggerService.error(
				'page-networkboost.component.getNetworkBoostStatus',
				'ERROR in setNetworkBoostStatus()-->' + err
			);
		}
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = GAMING_DATA.buildPage('network-boost');
		this.fetchSubscrition = this.cmsService
			.fetchCMSContent(queryOptions)
			.subscribe((response: any) => {
				const cardContentPositionC = this.cmsService.getOneCMSContent(
					response,
					'half-width-title-description-link-image',
					'position-C'
				)[0];
				if (cardContentPositionC) {
					this.cardContentPositionC = cardContentPositionC;
				}

				const cardContentPositionF = this.cmsService.getOneCMSContent(
					response,
					'inner-page-right-side-article-image-background',
					'position-F'
				)[0];
				if (cardContentPositionF) {
					this.cardContentPositionF = cardContentPositionF;
					if (this.cardContentPositionF.BrandName) {
						this.cardContentPositionF.BrandName = this.cardContentPositionF.BrandName.split(
							'|'
						)[0];
					}
				}
			});

		if (!this.isOnline) {
			this.cardContentPositionC = GAMING_DATA.buildFeatureImage(
				'assets/cms-cache/GamingPosC.jpg'
			);
			this.cardContentPositionF = GAMING_DATA.buildFeatureImage(
				'assets/cms-cache/network_boost_offline.jpg'
			);
		}
	}

	// version:3.3.3 quick setting toolbar& toast
	networkBoostRegisterEvent() {
		this.networkBoostEvent = this.onGamingQuickSettingsNetworkBoostStatusChangedEvent.bind(
			this
		);
		this.gamingQuickSettingToolbarService.registerEvent('NetworkBoost');
		this.shellServices.registerEvent(
			EventTypes.gamingQuickSettingsNetworkBoostStatusChangedEvent,
			this.networkBoostEvent
		);
	}

	onGamingQuickSettingsNetworkBoostStatusChangedEvent(status: any) {
		this.ngZone.run(() => {
			status = status === 1 ? true : false;
			this.loggerService.info(
				`Widget-LegionEdge-onGamingQuickSettingsNetworkBoostStatusChangedEvent: call back from ${this.toggleStatus} to ${status}`
			);
			if (status !== undefined && this.toggleStatus !== status) {
				this.toggleStatus = status;
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.NetworkBoostStatus,
					status
				);
			}
		});
	}

	networkBoostUnRegisterEvent() {
		this.gamingQuickSettingToolbarService.unregisterEvent('NetworkBoost');
		this.shellServices.unRegisterEvent(
			EventTypes.gamingQuickSettingsNetworkBoostStatusChangedEvent,
			this.networkBoostEvent
		);
	}

	// Versioin 3.8 for protocol
	public checkGamingCapabilities() {
		if (!this.gamingAllCapabilitiesService.isGetCapabilitiesAready) {
			this.gamingAllCapabilitiesService
			.getCapabilities()
			.then((response) => {
				if (response) {
					this.gamingAllCapabilitiesService.setCapabilityValuesGlobally(response);
					if (!response.networkBoostFeature || !response.fbnetFilter) {
						this.router.navigate(['/device-gaming']);
					}
				}
			})
			.catch((err) => { });
		} else {
			const networkBoostFeature = this.localCacheService.getLocalCacheValue(LocalStorageKey.networkBoostFeature, false);
			const fbNetFilter = this.localCacheService.getLocalCacheValue(LocalStorageKey.fbNetFilter, false);
			if (!networkBoostFeature || !fbNetFilter) {
				this.router.navigate(['/device-gaming']);
			}
		}
	}
}
