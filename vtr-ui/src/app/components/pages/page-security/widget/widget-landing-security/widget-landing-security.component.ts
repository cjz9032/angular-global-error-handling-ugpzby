import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-widget-landing-security',
	templateUrl: './widget-landing-security.component.html',
	styleUrls: ['./widget-landing-security.component.scss']
})
export class WidgetLandingSecurityComponent implements OnInit {

	@Input() items: Array<any>;
	constructor(public commonService: CommonService) {}
	badgeContent = 'security.landing.haveOwn';
	ngOnInit() {
	}

	haveOwn(check: boolean, id: string) {
		const item = this.items.find(e => e.id === id);
		item.showOwn = !check;
		if (id.includes('passwordManager')) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingPasswordManagerShowOwn, item.showOwn);
		}
		if (id.includes('vpn')) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingVPNShowOwn, item.showOwn);
		}
		if (id.includes('wifiSecurity')) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityShowOwn, item.showOwn);
		}
	}

}
