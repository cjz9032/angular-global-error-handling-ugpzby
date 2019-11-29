import { SecurityAdvisor, WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
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

@Component({
	selector: 'vtr-widget-security-status',
	templateUrl: './widget-security-status.component.html',
	styleUrls: ['./widget-security-status.component.scss']
})
export class WidgetSecurityStatusComponent implements OnInit {

	@Input() securityAdvisor: SecurityAdvisor;
	items: Array<WidgetItem>;
	region: string;
	isRS5OrLater: boolean;
	@Input() linkId: string;
	constructor(
		private commonService: CommonService,
		private translateService: TranslateService,
		private localInfoService: LocalInfoService,
		private ngZone: NgZone,
		private windowsHelloService: WindowsHelloService) { }

	ngOnInit() {
		this.items = [
			new AntivirusWidgetItem(this.securityAdvisor.antivirus, this.commonService, this.translateService),
			new WifiSecurityWidgetItem(this.securityAdvisor.wifiSecurity, this.commonService, this.translateService, this.ngZone),
			new PassWordManagerWidgetItem(this.securityAdvisor.passwordManager, this.commonService, this.translateService)
		];
		this.localInfoService.getLocalInfo().then(result => {
			this.region = result.GEO;
			this.showVpn();
		}).catch(e => {
			this.region = 'us';
			this.showVpn();
		});
		const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
		if (cacheShowWindowsHello) {
			this.items.push(new WindowsHelloWidgetItem(this.securityAdvisor.windowsHello, this.commonService, this.translateService));
		}
		const cacheShowWifiSecurity = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity);
		if (cacheShowWifiSecurity) {
			this.items.splice(1, 0, new WifiSecurityWidgetItem(this.securityAdvisor.wifiSecurity, this.commonService, this.translateService, this.ngZone));
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
			this.showWindowsHelloItem(windowsHello);
		}
		windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.showWindowsHelloItem(windowsHello);
		});
		wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, () => {
			this.showWifiSecurityItem();
		});
	}

	showWindowsHelloItem(windowsHello: WindowsHello) {
		const windowsHelloItem = this.items.find(item => item.id.startsWith('sa-widget-lnk-wh'));
		if (this.windowsHelloService.showWindowsHello()) {
			if (!windowsHelloItem) {
				this.items.push(new WindowsHelloWidgetItem(this.securityAdvisor.windowsHello, this.commonService, this.translateService));
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, true);
		} else {
			if (windowsHelloItem) {
				this.items = this.items.filter(item => !item.id.startsWith('sa-widget-lnk-wh'));
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, false);
		}
	}

	showVpn() {
		const vpnItem = this.items.find(item => item.id.startsWith('sa-widget-lnk-vpn'));
		if (this.region !== 'cn') {
			if (!vpnItem) {
				this.items.splice(3, 0, new VPNWidgetItem(this.securityAdvisor.vpn, this.commonService, this.translateService));
			}
		} else {
			if (vpnItem) {
				this.items = this.items.filter(item => !item.id.startsWith('sa-widget-lnk-vpn'));
			}
		}
	}

	showWifiSecurityItem() {
		const wifiSecurityItem = this.items.find(item => item.id.startsWith('sa-widget-lnk-ws'));
		if (this.securityAdvisor.wifiSecurity.isSupported) {
			if (!wifiSecurityItem) {
				this.items.splice(1, 0, new WifiSecurityWidgetItem(this.securityAdvisor.wifiSecurity, this.commonService, this.translateService, this.ngZone));
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, true);
		} else {
			if (wifiSecurityItem) {
				this.items = this.items.filter(item => !item.id.startsWith('sa-widget-lnk-ws'));
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, false);
		}
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.securityAdvisor.refresh();
		this.showVpn();
	}

}
