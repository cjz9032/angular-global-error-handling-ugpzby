import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { subAppConfigList } from 'src/sub-app-config/sub-app-config';
import { ConfigService } from 'src/app/services/config/config.service';
import { HistoryManager } from 'src/app/services/history-manager/history-manager.service';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { SelfSelectService } from 'src/app/services/self-select/self-select.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { AppMessage } from './app-message';
import { SubAppSendMessageType } from './app-message-type';
import { LoggerService } from '../logger/logger.service';
import { MetricEventName } from 'src/app/enums/metrics.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class ContainerAppReceiveHandler {
	public messageFromSubApp: any;
	readonly defaultMenuIndex = '999'; // default menu index in main app
	private metrics: any;
	private readonly metricsParent = 'ContainerAppReceiveHandler';

	constructor(
		private ngZone: NgZone,
		private configService: ConfigService,
		private historyManager: HistoryManager,
		private dccService: DccService,
		private selfSelectService: SelfSelectService,
		private router: Router,
		private userService: UserService,
		private loggerService: LoggerService,
		private shellService: VantageShellService
	) {
		this.messageFromSubApp = new BehaviorSubject<any>({ init: 'init' });
		this.metrics = this.shellService.getMetrics();
	}

	public handle(appMessage: AppMessage, origin = '') {
		const isCrossOrigin = origin !== '';
		let allowSendMetrics = true;
		if (
			isCrossOrigin &&
			subAppConfigList.find((subAppConfig) => subAppConfig.origin === origin) === undefined
		) {
			return;
		}
		try {
			switch (appMessage?.messageType) {
				case SubAppSendMessageType.isLoaded:
					this.setSubAppLoadedState(appMessage);
					break;
				case SubAppSendMessageType.shadowMenuForModal:
					if (appMessage.payload && appMessage.payload.isShadowMenu !== undefined) {
						this.shadowMenuForArticleModal(appMessage.payload.isShadowMenu);
					}
					break;
				case SubAppSendMessageType.setSmartAssistMenuForSettingsApp:
					if (
						appMessage.payload &&
						appMessage.payload.isSmartAssistMenuExistInSettingsApp !== undefined
					) {
						this.setSmartAssistMenuForSettingsApp(
							appMessage.payload.isSmartAssistMenuExistInSettingsApp
						);
					}
					break;
				case SubAppSendMessageType.goBackInContainerApp:
					this.goBackInContainerApp();
					break;
				case SubAppSendMessageType.navigateInContainerApp:
					if (
						appMessage.payload &&
						appMessage.payload.containerAppRoutePath !== undefined
					) {
						this.navigateInContainerApp(appMessage.payload.containerAppRoutePath);
					}
					break;
				case SubAppSendMessageType.clickInIframe:
					if (!isCrossOrigin) {
						this.addIframeClickListener(appMessage);
					} else {
						this.messageFromSubApp.next(appMessage);
					}
					allowSendMetrics = false;
					break;
				default:
					this.loggerService.info(`receive unknown message:`, appMessage);
					break;
			}
		} catch (error) {
			this.loggerService.error(`container app receive message exception`, error);
			const metricsData = {
				ItemParent: this.metricsParent,
				ItemType: MetricEventName.mfcommunication,
				ItemName: 'containerAppReceiveMessageException',
				ItemValue: error,
			};
			if (this.metrics) {
				this.metrics.sendAsync(metricsData);
			}
		}
		if (allowSendMetrics) {
			const metricsData = {
				ItemParent: this.metricsParent,
				ItemType: MetricEventName.mfcommunication,
				ItemName: 'containerAppReceiveMessage',
				ItemValue: appMessage.messageType,
			};
			if (this.metrics) {
				this.metrics.sendAsync(metricsData);
			}
		}
	}

	private setSubAppLoadedState(appMessage: AppMessage) {
		if (!appMessage.appName) {
			return;
		}

		const subAppConfigSelected = subAppConfigList.find(
			(subAppConfig) => subAppConfig.name === appMessage.appName
		);
		if (subAppConfigSelected) {
			subAppConfigSelected.isIframeLoaded = true;
			this.dccService.setHeaderImageInSubApp(subAppConfigSelected);
			this.selfSelectService.setSegmentInSubApp(subAppConfigSelected);
			this.userService.setLidInSubApp(subAppConfigSelected);
			subAppConfigSelected.webVersion = appMessage.webVersion ?? '';
			subAppConfigSelected.jsBridgeVersion = appMessage.bridgeVersion ?? '';
			subAppConfigSelected.isIframeLoadedSubject.next(true);
		}
	}

	private setSmartAssistMenuForSettingsApp(isSmartAssistMenuExist: boolean) {
		if (isSmartAssistMenuExist) {
			this.configService.addSmartAssistMenuFromSettingsApp();
		} else {
			this.configService.removeSmartAssistMenuFromSettingsApp();
		}
	}

	private shadowMenuForArticleModal(isShadowMenu: boolean) {
		if (isShadowMenu) {
			(document.querySelector('vtr-menu-main') as HTMLElement).style.zIndex = 'auto';
		} else {
			(document.querySelector(
				'vtr-menu-main'
			) as HTMLElement).style.zIndex = this.defaultMenuIndex;
		}
	}

	private goBackInContainerApp() {
		this.ngZone.run(() => {
			this.historyManager.goBack();
		});
	}

	private navigateInContainerApp(containerAppSubUrl: string) {
		this.ngZone.run(() => {
			this.router.navigateByUrl(containerAppSubUrl);
		});
	}

	private addIframeClickListener(appMessage: AppMessage) {
		if (!appMessage.appName) {
			return;
		}
		const subAppConfigSelected = subAppConfigList.find(
			(subAppConfig) => subAppConfig.name === appMessage.appName
		);
		subAppConfigSelected?.isIframeLoadedSubject.subscribe((isIframeLoaded) => {
			if (isIframeLoaded) {
				const iframe: any = document.querySelector('#iframe-' + subAppConfigSelected.name);
				iframe.contentWindow.addEventListener(
					'click',
					() => {
						this.messageFromSubApp.next(appMessage);
					},
					false
				);
			}
		});
	}
}
