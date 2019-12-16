import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-widget-landing-security',
	templateUrl: './widget-landing-security.component.html',
	styleUrls: ['./widget-landing-security.component.scss']
})
export class WidgetLandingSecurityComponent implements OnInit {

	@Input() items: Array<any>;
	@Output() haveOwnChecked = new EventEmitter<any>();
	checkedList: any;
	constructor(public commonService: CommonService) {}
	badgeContent = 'security.landing.haveOwn';
	ngOnInit() {
		this.checkedList = {
			passwordManager: this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingPasswordManagerShowOwn, undefined),
			vpn: this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingVPNShowOwn, undefined),
			wifiSecurity: this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityShowOwn, undefined)
		};
	}

	haveOwn(check: boolean, id: string) {
		const item = this.items.find(e => e.id === id);
		item.showOwn = !check;
		if (id.includes('passwordManager')) {
			this.checkedList.passwordManager = item.showOwn;
			this.haveOwnChecked.emit(this.checkedList);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingPasswordManagerShowOwn, item.showOwn);
		}
		if (id.includes('vpn')) {
			this.checkedList.vpn = item.showOwn;
			this.haveOwnChecked.emit(this.checkedList);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingVPNShowOwn, item.showOwn);
		}
		if (id.includes('wifiSecurity')) {
			this.checkedList.wifiSecurity = item.showOwn;
			this.haveOwnChecked.emit(this.checkedList);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityShowOwn, item.showOwn);
		}
	}

}
