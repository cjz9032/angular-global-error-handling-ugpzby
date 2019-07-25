import { Component, OnInit, OnDestroy, Input, HostListener, NgZone } from '@angular/core';
import { SecurityAdvisor, WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { WidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/widget-item.model';
import { AntivirusWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/antivirus-widget-item.model';
import { WifiSecurityWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/wifisecurity-widget-item.model';
import { PassWordManagerWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/password-manager-widget-item.model';
import { VPNWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/vpn-widget-item.model';
import { WindowsHelloWidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/windows-hello-widgt-item.model';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { RegionService } from 'src/app/services/region/region.service';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';

@Component({
	selector: 'vtr-widget-security-status',
	templateUrl: './widget-security-status.component.html',
	styleUrls: ['./widget-security-status.component.scss']
})
export class WidgetSecurityStatusComponent implements OnInit, OnDestroy {

	@Input() securityAdvisor: SecurityAdvisor;
	items: Array<WidgetItem>;
	region: string;
	isRS5OrLater: boolean;

	constructor(
		private commonService: CommonService,
		private translateService: TranslateService,
		private regionService: RegionService,
		private ngZone: NgZone,
		private windowsHelloService: WindowsHelloService) {}

	ngOnInit() {
		this.items = [];
		this.items.push(new AntivirusWidgetItem(this.securityAdvisor.antivirus, this.commonService, this.translateService));
		this.items.push(new WifiSecurityWidgetItem(this.securityAdvisor.wifiSecurity, this.commonService, this.translateService, this.ngZone));
		this.items.push(new PassWordManagerWidgetItem(this.securityAdvisor.passwordManager, this.commonService, this.translateService));
		this.showVpn();
		const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
		if (cacheShowWindowsHello) {
			this.items.push(new WindowsHelloWidgetItem(this.securityAdvisor.windowsHello, this.commonService, this.translateService));
		}
		const windowsHello = this.securityAdvisor.windowsHello;
		if (this.securityAdvisor) {
			this.securityAdvisor.refresh();
		}
		if (!this.securityAdvisor.wifiSecurity.state) {
			this.securityAdvisor.wifiSecurity.getWifiSecurityState();
		}
		if (windowsHello.fingerPrintStatus) {
			this.showWindowsHelloItem(windowsHello);
		}
		windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.showWindowsHelloItem(windowsHello);
		});
	}

	ngOnDestroy() {
		this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
	}

	showWindowsHelloItem(windowsHello: WindowsHello) {
		const windowsHelloItem = this.items.find(item => item.id === 'sa-widget-lnk-wh');
		if (this.windowsHelloService.showWindowsHello()) {
			if (!windowsHelloItem) {
				this.items.push(new WindowsHelloWidgetItem(this.securityAdvisor.windowsHello, this.commonService, this.translateService));
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, true);
		} else {
			if (windowsHelloItem) {
				this.items = this.items.filter(item => item.id !== 'sa-widget-lnk-wh');
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, false);
		}
	}
	showVpn() {
		this.regionService.getRegion().subscribe({
			next: x => { this.region = x; },
			error: () => { this.region = 'US'; }
		});
		const vpnItem = this.items.find(item => item.id === 'sa-widget-lnk-vpn');
		if (this.region !== 'CN') {
			if (!vpnItem) {
				this.items.splice(3, 0, new VPNWidgetItem(this.securityAdvisor.vpn, this.commonService, this.translateService));
			}
		} else {
			if (vpnItem) {
				this.items = this.items.filter(item => item.id !== 'sa-widget-lnk-vpn');
			}
		}
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.securityAdvisor.refresh();
		this.showVpn();
	}

}
