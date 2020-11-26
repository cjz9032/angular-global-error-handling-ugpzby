import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { NgZone } from '@angular/core';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

export class WifiSecurityLandingViewModel {
	wfStatus = {
		status: 'loading',
		icon: 'landing-wifi',
		title: 'common.securityAdvisor.wifi',
		buttonLabel: 'security.landing.goWifi',
		buttonLink: '/security/wifi-security',
		content: 'security.landing.wifiContent',
		showOwn: false,
		ownTitle: 'security.landing.haveOwnWifi',
		id: 'sa-ov-link-wifiSecurity',
		detail: '',
	};
	translateString: any;

	constructor(
		translate: TranslateService,
		wfModel: phoenix.WifiSecurity,
		public commonService: CommonService,
		private localCacheService: LocalCacheService,
		ngZone: NgZone
	) {
		wfModel.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			ngZone.run(() => {
				this.setWiFiSecurityState(wfModel.state, data);
			});
		});
		wfModel.on(EventTypes.wsStateEvent, (data) => {
			this.setWiFiSecurityState(data, wfModel.isLocationServiceOn);
		});

		translate
			.stream([
				'common.securityAdvisor.loading',
				'common.securityAdvisor.enabled',
				'common.securityAdvisor.disabled',
				'common.securityAdvisor.wifi',
				'security.landing.goWifi',
				'security.landing.wifiContent',
				'security.landing.haveOwnWifi',
			])
			.subscribe((res) => {
				this.translateString = res;
				if (!this.wfStatus.detail) {
					this.wfStatus.detail = res['common.securityAdvisor.loading'];
				}
				this.wfStatus.title = res['common.securityAdvisor.wifi'];
				this.wfStatus.content = res['security.landing.wifiContent'];
				this.wfStatus.ownTitle = res['security.landing.haveOwnWifi'];
				this.wfStatus.buttonLabel = res['security.landing.goWifi'];
				const cacheStatus = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.SecurityWifiSecurityState
				);
				const cacheShowOwn: boolean = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.SecurityLandingWifiSecurityShowOwn,
					null
				);
				this.wfStatus.showOwn = cacheShowOwn ? cacheShowOwn : false;
				if (wfModel && wfModel.state) {
					if (wfModel.isLocationServiceOn !== undefined) {
						this.setWiFiSecurityState(wfModel.state, wfModel.isLocationServiceOn);
					}
				} else if (cacheStatus) {
					if (wfModel && wfModel.isLocationServiceOn !== undefined) {
						this.setWiFiSecurityState(cacheStatus, wfModel.isLocationServiceOn);
					}
				}
			});
	}

	setWiFiSecurityState(state: string, location: any) {
		if (!this.translateString) {
			return;
		}
		const cacheShowOwn: boolean = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityLandingWifiSecurityShowOwn,
			null
		);
		this.wfStatus.showOwn = cacheShowOwn ? cacheShowOwn : false;
		if (location) {
			this.wfStatus.status = state === 'enabled' ? 'enabled' : 'disabled';
			this.wfStatus.detail = this.translateString[
				`common.securityAdvisor.${state === 'enabled' ? 'enabled' : 'disabled'}`
			];
		} else {
			this.wfStatus.status = 'disabled';
			this.wfStatus.detail = this.translateString['common.securityAdvisor.disabled'];
		}
		if (state) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityWifiSecurityState,
				state
			);
		}
	}
}
