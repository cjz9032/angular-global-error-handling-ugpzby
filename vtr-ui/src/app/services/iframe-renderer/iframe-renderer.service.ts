import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { subAppConfigList } from 'src/sub-app-config/sub-app-config';
import { ISubAppConfig } from 'src/sub-app-config/sub-app-config-base';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { DeviceService } from 'src/app/services/device/device.service';

@Injectable({
	providedIn: 'root'
})
export class IframeRenderer {
	private renderer: Renderer2;

	constructor(
		private rendererFactory: RendererFactory2,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private deviceService: DeviceService
	) {
		this.renderer = this.rendererFactory.createRenderer(null, null);
	}

	public renderIframe(subAppConfig: ISubAppConfig) {
		const ifameContainer = document.querySelector('.sub-app-iframe-container');
		const iframe = this.renderer.createElement('iframe');
		iframe.onload = this.iframeOnload(subAppConfig);
		this.renderer.setAttribute(iframe, 'id', 'iframe-' + subAppConfig.name);
		this.renderer.setAttribute(iframe, 'src', subAppConfig.url);
		this.renderer.setAttribute(iframe, 'frameborder', '0');
		this.renderer.setAttribute(iframe, 'attr.sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation');
		this.renderer.setStyle(iframe, 'position', 'fixed');
		this.renderer.setStyle(iframe, 'top', '0');
		this.renderer.setStyle(iframe, 'width', '100%');
		this.renderer.setStyle(iframe, 'height', '100%');
		this.renderer.setStyle(iframe, 'display', 'none');
		this.renderer.appendChild(ifameContainer, iframe);
	}

	private iframeOnload(subAppConfig: ISubAppConfig) {
		let iframeTimeOutTimes = 0;
		const setIframeTimeOutInterval = setInterval(() => {
			iframeTimeOutTimes++;
			if (subAppConfig.isIframeLoaded) {
				clearInterval(setIframeTimeOutInterval);
			} else {
				if (iframeTimeOutTimes < 10 && this.commonService.isOnline) {
					const iframe: any = document.querySelector('#iframe-' + subAppConfig.name);
					if (iframe) {
						iframe.src = subAppConfig.url;
					} else {
						clearInterval(setIframeTimeOutInterval);
					}
				} else {
					clearInterval(setIframeTimeOutInterval);
				}
			}
		}, 10000);
	}

	public destroyIframe(subAppConfig: ISubAppConfig) {
		const iframe: any = document.querySelector('#iframe-' + subAppConfig.name);
		if (iframe) {
			iframe.src = '';
			if (!subAppConfig.isCrossOrigin) {
				iframe.contentWindow.document.write('');
				iframe.contentWindow.close();
			}
			iframe.remove();
			subAppConfig.isIframeLoaded = false;
			subAppConfig.isIframeLoadedSubject.next(false);
		}
	}

	public preloadSubApp() {
		const welcomeTutorial = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.WelcomeTutorial
		);
		for (const subAppConfig of subAppConfigList) {
			if (subAppConfig.name === 'settings'
				&& welcomeTutorial
				&& welcomeTutorial.isDone
				&& !this.deviceService.isArm
				&& subAppConfig.isFirstLoad
				&& subAppConfig.isPreloadEnabled
				|| subAppConfig.name !== 'settings'
				&& subAppConfig.isFirstLoad
				&& subAppConfig.isPreloadEnabled) {
				subAppConfig.isFirstLoad = false;
				this.renderIframe(subAppConfig);
			}
		}
	}
}
