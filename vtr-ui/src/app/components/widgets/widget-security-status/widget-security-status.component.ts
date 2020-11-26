import { SecurityAdvisor, EventTypes } from '@lenovo/tan-client-bridge';
import { Component, OnInit, Input, HostListener, NgZone } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { WidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/widget-item.model';
import { AntivirusWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/antivirus-widget-item.model';
import { WifiSecurityWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/wifisecurity-widget-item.model';
import { PassWordManagerWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/password-manager-widget-item.model';
import { VPNWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/vpn-widget-item.model';
import { WindowsHelloWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/windows-hello-widgt-item.model';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { UACWidgetItemViewModel } from 'src/app/data-models/security-advisor/widget-security-status/uac-widget-item.model';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { AntivirusService } from 'src/app/services/security/antivirus.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-widget-security-status',
	templateUrl: './widget-security-status.component.html',
	styleUrls: ['./widget-security-status.component.scss'],
})
export class WidgetSecurityStatusComponent implements OnInit {
	@Input() securityAdvisor: SecurityAdvisor;
	items: Array<WidgetItem>;
	region: string;
	pluginSupport: boolean;
	refreshTimeout: ReturnType<typeof setTimeout>;

	@Input() linkId: string;
	constructor(
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private translateService: TranslateService,
		private deviceService: DeviceService,
		private ngZone: NgZone,
		private windowsHelloService: WindowsHelloService,
		private hypSettings: HypothesisService,
		private antivirusService: AntivirusService
	) {}

	ngOnInit() {
		this.items = [
			new AntivirusWidgetItem(
				this.securityAdvisor.antivirus,
				this.commonService,
				this.translateService,
				this.antivirusService
			),
			new PassWordManagerWidgetItem(
				this.securityAdvisor.passwordManager,
				this.commonService,
				this.localCacheService,
				this.translateService
			),
			new UACWidgetItemViewModel(
				this.securityAdvisor.uac,
				this.localCacheService,
				this.translateService
			),
		];
		this.deviceService
			.getMachineInfo()
			.then((result) => {
				this.region = (result.country ? result.country : 'US').toLowerCase();
				this.showVpn();
				this.showDashlane();
			})
			.catch(() => {
				this.region = 'us';
				this.showVpn();
				this.showDashlane();
			});

		this.hypSettings
			.getFeatureSetting('SecurityAdvisor')
			.then((result) => {
				this.pluginSupport = result === 'true';
			})
			.catch((e) => {
				this.pluginSupport = false;
			})
			.finally(() => {
				this.showUac();
			});

		const cacheShowWindowsHello = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityShowWindowsHello
		);
		if (cacheShowWindowsHello) {
			this.items.splice(
				this.items.length - 1,
				0,
				new WindowsHelloWidgetItem(
					this.securityAdvisor.windowsHello,
					this.commonService,
					this.localCacheService,
					this.translateService
				)
			);
		}
		const cacheShowWifiSecurity = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityShowWifiSecurity
		);
		if (cacheShowWifiSecurity) {
			this.items.splice(
				2,
				0,
				new WifiSecurityWidgetItem(
					this.securityAdvisor.wifiSecurity,
					this.commonService,
					this.localCacheService,
					this.translateService,
					this.ngZone
				)
			);
		}
		const windowsHello = this.securityAdvisor.windowsHello;
		const wifiSecurity = this.securityAdvisor.wifiSecurity;
		if (this.securityAdvisor) {
			this.securityAdvisor.refresh();
		}
		if (!this.securityAdvisor.wifiSecurity.state) {
			this.securityAdvisor.wifiSecurity.getWifiSecurityState();
		}
		if (wifiSecurity.isSupported !== undefined) {
			this.showWifiSecurityItem();
		}
		if (windowsHello.fingerPrintStatus) {
			this.showWindowsHelloItem();
		}
		windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.showWindowsHelloItem();
		});
		wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, () => {
			this.showWifiSecurityItem();
		});
	}

	showWindowsHelloItem() {
		const windowsHelloItem = this.items.find((item) => item.id.startsWith('sa-widget-lnk-wh'));
		if (this.windowsHelloService.showWindowsHello(this.securityAdvisor.windowsHello)) {
			if (!windowsHelloItem) {
				this.items.splice(
					this.items.length - 1,
					0,
					new WindowsHelloWidgetItem(
						this.securityAdvisor.windowsHello,
						this.commonService,
						this.localCacheService,
						this.translateService
					)
				);
			}
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityShowWindowsHello,
				true
			);
		} else {
			if (windowsHelloItem) {
				this.items = this.items.filter((item) => !item.id.startsWith('sa-widget-lnk-wh'));
			}
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityShowWindowsHello,
				false
			);
		}
	}

	showVpn() {
		const vpnItem = this.items.find((item) => item.id.startsWith('sa-widget-lnk-vpn'));
		if (this.region !== 'cn') {
			if (!vpnItem) {
				this.items.splice(
					3,
					0,
					new VPNWidgetItem(
						this.securityAdvisor.vpn,
						this.commonService,
						this.localCacheService,
						this.translateService
					)
				);
			}
		} else {
			if (vpnItem) {
				this.items = this.items.filter((item) => !item.id.startsWith('sa-widget-lnk-vpn'));
			}
		}
	}

	showDashlane() {
		const dashlaneItem = this.items.find((item) => item.id.startsWith('sa-widget-lnk-pm'));
		if (this.region !== 'cn') {
			if (!dashlaneItem) {
				this.items.splice(
					2,
					0,
					new PassWordManagerWidgetItem(
						this.securityAdvisor.passwordManager,
						this.commonService,
						this.localCacheService,
						this.translateService
					)
				);
			}
		} else {
			if (dashlaneItem) {
				this.items = this.items.filter((item) => !item.id.startsWith('sa-widget-lnk-pm'));
			}
		}
	}

	showUac() {
		const uacItem = this.items.find((item) => item.id.startsWith('sa-widget-lnk-uac'));
		if (!this.pluginSupport && uacItem) {
			this.items = this.items.filter((item) => !item.id.startsWith('sa-widget-lnk-uac'));
		}
	}

	showWifiSecurityItem() {
		const wifiSecurityItem = this.items.find((item) => item.id.startsWith('sa-widget-lnk-ws'));
		if (this.securityAdvisor.wifiSecurity.isSupported) {
			if (!wifiSecurityItem) {
				this.items.splice(
					1,
					0,
					new WifiSecurityWidgetItem(
						this.securityAdvisor.wifiSecurity,
						this.commonService,
						this.localCacheService,
						this.translateService,
						this.ngZone
					)
				);
			}
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityShowWifiSecurity,
				true
			);
		} else {
			if (wifiSecurityItem) {
				this.items = this.items.filter((item) => !item.id.startsWith('sa-widget-lnk-ws'));
			}
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityShowWifiSecurity,
				false
			);
		}
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.refreshPage(document.activeElement.id);
	}

	@HostListener('document:click', ['$event'])
	onClick(event) {
		this.refreshPage(event.target.id);
	}

	refreshPage(id: string) {
		clearTimeout(this.refreshTimeout);
		this.refreshTimeout = setTimeout(() => {
			if (
				id === 'sa-av-button-launch-mcafee' ||
				(id.startsWith('sa-av') && id.endsWith('subscribe'))
			) {
				return;
			}
			this.securityAdvisor.refresh();
			this.showVpn();
			this.showDashlane();
		}, 100);
	}
}
