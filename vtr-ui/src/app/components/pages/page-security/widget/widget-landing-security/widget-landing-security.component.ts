import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { Antivirus } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-widget-landing-security',
	templateUrl: './widget-landing-security.component.html',
	styleUrls: ['./widget-landing-security.component.scss']
})
export class WidgetLandingSecurityComponent implements OnInit {

	@Input() items: Array<any>;
	@Output() haveOwnChecked = new EventEmitter<any>();
	@Output() retryClick = new EventEmitter<any>();
	checkedList: any;
	antivirus: Antivirus;
	constructor(
		public commonService: CommonService,
		private shellService: VantageShellService
		) {}
	badgeContent = 'security.landing.haveOwn';
	ngOnInit() {
		this.antivirus = this.shellService.getSecurityAdvisor().antivirus;
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

	retry(item) {
		this.retryClick.emit(item.id);
	}
}
