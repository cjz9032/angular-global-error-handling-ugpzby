import { Component, OnInit, OnDestroy } from '@angular/core';
import { HistoryManager } from 'src/app/services/history-manager/history-manager.service';
import { IframeRenderer } from 'src/app/services/iframe-renderer/iframe-renderer.service';
import { Subscription } from 'rxjs';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { settingsAppConfig } from 'src/sub-app-config/sub-app-config';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { VantageRefreshType } from 'src/app/enums/vantage-refresh-type';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { ContainerAppSendHandler } from 'src/app/services/communication/container-app-send.handler';
import { ContainerAppSendMessageType } from 'src/app/services/communication/app-message-type';

@Component({
	selector: 'vtr-page-settings-app-transition',
	templateUrl: './page-settings-app-transition.component.html',
	styleUrls: ['./page-settings-app-transition.component.scss'],
})
export class PageSettingsAppTransitionComponent implements OnInit, OnDestroy {
	backarrow = '< ';
	private isSettingsIframeLoadedSubscription: Subscription;
	public isSettingsIframeShowed = false;
	private setIframeTimeOutInterval: any;
	constructor(
		private historyManager: HistoryManager,
		private containerAppSendHandler: ContainerAppSendHandler,
		private iframeRenderer: IframeRenderer,
		public dccService: DccService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		private metricsService: MetricService
	) {}

	ngOnInit() {
		this.isSettingsIframeLoadedSubscription = settingsAppConfig.isIframeLoadedSubject.subscribe(
			(isIframeLoaded) => {
				if (isIframeLoaded) {
					const currentUrl = window.location.href;
					const currentSettingsAppSubUrl = currentUrl.substring(
						(window.location.origin + window.location.pathname).length + 1
					);
					const payload = { subAppSubUrl: currentSettingsAppSubUrl };
					this.containerAppSendHandler.handle(
						settingsAppConfig,
						ContainerAppSendMessageType.navigateInSubApp,
						payload
					);
					this.showSettingsIframe();
				}
			}
		);
		let iframe: any = document.querySelector('#iframe-' + settingsAppConfig.name);
		if (!iframe) {
			settingsAppConfig.isFirstLoad = false;
			this.iframeRenderer.renderIframe(settingsAppConfig);
		}
		if (!settingsAppConfig.isIframeLoaded && this.commonService.isOnline) {
			let iframeTimeOutTimes = 0;
			this.setIframeTimeOutInterval = setInterval(() => {
				iframeTimeOutTimes++;
				if (settingsAppConfig.isIframeLoaded) {
					clearInterval(this.setIframeTimeOutInterval);
				} else {
					if (iframeTimeOutTimes < 3 && this.commonService.isOnline) {
						iframe = document.querySelector('#iframe-' + settingsAppConfig.name);
						iframe.src = settingsAppConfig.url;
					} else {
						clearInterval(this.setIframeTimeOutInterval);
						this.reloadVantage(VantageRefreshType.OfflineBuildIn);
					}
				}
			}, 5000);
		} else if (!settingsAppConfig.isIframeLoaded && !this.commonService.isOnline) {
			setTimeout(() => {
				if (!this.isSettingsIframeShowed) {
					this.reloadVantage(VantageRefreshType.OfflineBuildIn);
				}
			}, 1500);
		}
	}

	ngOnDestroy() {
		if (settingsAppConfig.isAutoDestroyEnabled) {
			this.iframeRenderer.destroyIframe(settingsAppConfig);
		} else {
			this.hideSettingsIframe();
		}
		if (this.isSettingsIframeLoadedSubscription) {
			this.isSettingsIframeLoadedSubscription.unsubscribe();
		}
		clearInterval(this.setIframeTimeOutInterval);
	}

	public goBack() {
		return this.historyManager.goBack();
	}

	private showSettingsIframe() {
		const iframe: any = document.querySelector('#iframe-' + settingsAppConfig.name);
		iframe.style.display = 'block';
		this.isSettingsIframeShowed = true;
	}

	private hideSettingsIframe() {
		const iframe: any = document.querySelector('#iframe-' + settingsAppConfig.name);
		iframe.style.display = 'none';
		this.isSettingsIframeShowed = false;
	}

	private reloadVantage(refreshType: string) {
		this.metricsService.sendAppRefreshMetric();
		const vantageStub = this.vantageShellService.getVantageStub();
		if (vantageStub && typeof vantageStub.refreshVantage === 'function') {
			vantageStub.refreshVantage(refreshType);
		}
	}
}
