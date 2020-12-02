import { GamingAutoCloseService } from './../../../services/gaming/gaming-autoclose/gaming-autoclose.service';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { GamingQuickSettingToolbarService } from 'src/app/services/gaming/gaming-quick-setting-toolbar/gaming-quick-setting-toolbar.service';
import { EventTypes } from '@lenovo/tan-client-bridge';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { ModalGamingRunningAppListComponent } from './../../modal/modal-gaming-running-app-list/modal-gaming-running-app-list.component';

@Component({
	selector: 'vtr-page-autoclose',
	templateUrl: './page-autoclose.component.html',
	styleUrls: ['./page-autoclose.component.scss'],
})
export class PageAutocloseComponent implements OnInit, OnDestroy {
	public autoCloseAppList: any;
	public autoCloseEvent: any;
	private cmsSubscription: Subscription;
	notificationSubscription: Subscription;
	refreshTrigger: number = 0;

	// Toggle status
	isOnline = true;
	toggleStatus: boolean = this.gamingAutoCloseService.getAutoCloseStatusCache() || false;
	needToAsk: any;
	autoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
	needToAskStatusObj: AutoCloseNeedToAsk = new AutoCloseNeedToAsk();

	// CMS Content block
	cardContentPositionC: any = {};
	cardContentPositionF: any = {};
	backId = 'vtr-gaming-autoclose-btn-back';
	dynamic_metricsItem: any = 'autoclose_cms_inner_content';

	isModalShowing: boolean;

	modalAutomationId: any = {
		section: 'autoclose_turnon_dialog',
		headerText: 'auto_close_turn_on_popup_header_text',
		description: 'auto_close_turn_on_popup_description',
		dontAskCheckbox: 'autoclose_turnon_dialog_checkbox_Dont_ask_again',
		closeButton: 'autoclose_turnon_dialog_close',
		cancelButton: 'autoclose_turnon_dialog_notnow',
		okButton: 'autoclose_turnon_dialog_turnon',
	};

	constructor(
		private cmsService: CMSService,
		private gamingAutoCloseService: GamingAutoCloseService,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private translate: TranslateService,
		private shellServices: VantageShellService,
		private gamingQuickSettingToolbarService: GamingQuickSettingToolbarService,
		private ngZone: NgZone,
		private modalService: NgbModal
	) {
		this.fetchCMSArticles();
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.isModalShowing = false;
		// AutoClose Init
		this.getAutoCloseStatus();
		this.autoCloseRegisterEvent();
		this.refreshTrigger += 1;
		this.notificationSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
	}

	private onNotification(notification: AppNotification) {
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

	openTargetModal() {
		if (this.isModalShowing === true) {
			return;
		}
		this.isModalShowing = true;
		try {
			this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
			this.needToAsk =
				this.needToAsk === undefined || isNaN(this.needToAsk) ? false : this.needToAsk;
			this.gamingAutoCloseService.setNeedToAskStatusCache(this.needToAsk);
			if (this.toggleStatus || this.needToAsk) {
				this.showAddApps();
			} else {
				this.showTurnOn();
			}
		} catch (error) {
			return undefined;
		}
	}

	showTurnOn() {
		let promptRef = this.modalService.open(ModalGamingPromptComponent, {
			backdrop: 'static',
			windowClass: 'modal-prompt',
			backdropClass: 'backdrop-level'
		});
		promptRef.componentInstance.info = {
			title: 'gaming.autoClose.modalTurnAutoClose.title',
			description: 'gaming.autoClose.modalTurnAutoClose.body',
			comfirmButton: 'gaming.autoClose.modalTurnAutoClose.btnConfirm',
			comfirmButtonAriaLabel: 'gaming.autoClose.modalTurnAutoCloseNarrator.turnOn',
			cancelButton: 'gaming.autoClose.modalTurnAutoClose.btnCancel',
			cancelButtonAriaLabel: 'gaming.autoClose.modalTurnAutoCloseNarrator.notNow',
			checkboxTitle: 'gaming.autoClose.modalTurnAutoClose.checkedTitle',
			dontAskNarrator: 'gaming.autoClose.modalTurnAutoCloseNarrator.dontask',
			confirmMetricEnabled: true,
			confirmMetricsItemId: 'autoclose_turn_on_button',
			cancelMetricEnabled: false,
			cancelMetricsItemId: '',
			id: this.modalAutomationId,
		};
		promptRef.componentInstance.emitService.subscribe((emmitedValue) => {
			if (emmitedValue === true || emmitedValue === false) {
				this.needToAsk = emmitedValue;
				this.setNotAskAgain(this.needToAsk);
			} else if (emmitedValue === 1) {
				// Turn on Auto Close
				this.setAutoCloseStatus(true);
			}
		});
		promptRef.result.then(() => {
			// Finally, open Add App Model
			this.showAddApps();
		});
	}

	showAddApps() {
		let appListRef = this.modalService.open(ModalGamingRunningAppListComponent, {
			backdrop: 'static',
			backdropClass: 'backdrop-level'
		});
		appListRef.componentInstance.setAppList(false, 0);
		appListRef.componentInstance.emitService.subscribe((val) => {
			this.refreshTrigger += 1;
		});
		appListRef.result.then(() => {
			this.refreshTrigger = -1;
			this.isModalShowing = false;
		});
	}

	setNotAskAgain(status: boolean) {
		try {
			this.gamingAutoCloseService.setNeedToAskStatusCache(status);
		} catch (error) {
			this.loggerService.error(
				'page-autoclose.component.setNotAskAgain',
				'ERROR in setNotAskAgain()-->' + error
			);
		}
	}

	toggleAutoClose(event: any) {
		this.setAutoCloseStatus(event.switchValue);
	}

	setAutoCloseStatus(status: boolean) {
		this.gamingAutoCloseService.setAutoCloseStatus(status).then((response: boolean) => {
			if (response) {
				this.gamingAutoCloseService.setAutoCloseStatusCache(status);
				this.toggleStatus = status;
			}
		});
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'auto-close',
		};
		this.cmsSubscription = this.cmsService
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
			this.cardContentPositionC = {
				FeatureImage: 'assets/cms-cache/GamingPosC.jpg',
			};

			this.cardContentPositionF = {
				FeatureImage: 'assets/cms-cache/autoclose_offline.jpg',
			};
		}
	}

	async getAutoCloseStatus() {
		try {
			this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
			this.toggleStatus = await this.gamingAutoCloseService.getAutoCloseStatus();
			this.gamingAutoCloseService.setAutoCloseStatusCache(this.toggleStatus);
		} catch (err) {
			this.loggerService.error(
				'page-autoclose.component.getAutoCloseStatus',
				'ERROR in getAutoCloseStatus()-->' + err
			);
		}
	}

	// version:3.3.3 quick setting toolbar& toast
	autoCloseRegisterEvent() {
		this.autoCloseEvent = this.onGamingQuickSettingsAutoCloseStatusChangedEvent.bind(this);
		this.gamingQuickSettingToolbarService.registerEvent('AutoClose');
		this.shellServices.registerEvent(
			EventTypes.gamingQuickSettingsAutoCloseStatusChangedEvent,
			this.autoCloseEvent
		);
	}

	onGamingQuickSettingsAutoCloseStatusChangedEvent(status: any) {
		this.ngZone.run(() => {
			status = status === 1 ? true : false;
			this.loggerService.info(
				`Widget-LegionEdge-onGamingQuickSettingsAutoCloseStatusChangedEvent: call back from ${this.toggleStatus} to ${status}`
			);
			if (status !== undefined && this.toggleStatus !== status) {
				this.toggleStatus = status;
				this.gamingAutoCloseService.setAutoCloseStatusCache(status);
			}
		});
	}

	autoCloseUnRegisterEvent() {
		this.gamingQuickSettingToolbarService.unregisterEvent('AutoClose');
		this.shellServices.unRegisterEvent(
			EventTypes.gamingQuickSettingsAutoCloseStatusChangedEvent,
			this.autoCloseEvent
		);
	}

	ngOnDestroy() {
		if (this.cmsSubscription) {
			this.cmsSubscription.unsubscribe();
		}

		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}

		this.autoCloseUnRegisterEvent();
	}
}
