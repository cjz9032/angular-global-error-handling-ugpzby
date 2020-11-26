import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-widget-landing-security',
	templateUrl: './widget-landing-security.component.html',
	styleUrls: ['./widget-landing-security.component.scss'],
})
export class WidgetLandingSecurityComponent implements OnInit {
	@Input() items: Array<any>;
	@Output() haveOwnChecked = new EventEmitter<any>();
	@Output() retryClick = new EventEmitter<any>();
	checkedList: any;
	constructor(
		public commonService: CommonService,
		private localCacheService: LocalCacheService,
		private shellService: VantageShellService
	) {}
	badgeContent = 'security.landing.haveOwn';
	ngOnInit() {
		this.checkedList = {
			passwordManager: this.localCacheService.getLocalCacheValue(
				LocalStorageKey.SecurityLandingPasswordManagerShowOwn,
				undefined
			),
			vpn: this.localCacheService.getLocalCacheValue(
				LocalStorageKey.SecurityLandingVPNShowOwn,
				undefined
			),
			wifiSecurity: this.localCacheService.getLocalCacheValue(
				LocalStorageKey.SecurityLandingWifiSecurityShowOwn,
				undefined
			),
		};
	}

	haveOwn(check: boolean, id: string) {
		const item = this.items.find((e) => e.id === id);
		item.showOwn = !check;
		if (id.includes('passwordManager')) {
			this.checkedList.passwordManager = item.showOwn;
			this.haveOwnChecked.emit(this.checkedList);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityLandingPasswordManagerShowOwn,
				item.showOwn
			);
		}
		if (id.includes('vpn')) {
			this.checkedList.vpn = item.showOwn;
			this.haveOwnChecked.emit(this.checkedList);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityLandingVPNShowOwn,
				item.showOwn
			);
		}
		if (id.includes('wifiSecurity')) {
			this.checkedList.wifiSecurity = item.showOwn;
			this.haveOwnChecked.emit(this.checkedList);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityLandingWifiSecurityShowOwn,
				item.showOwn
			);
		}
	}

	retry(item) {
		this.retryClick.emit(item.id);
	}

	goToSettings(path: string) {
		window.getSelection().empty();
		if (path) {
			WinRT.launchUri(path);
		}
	}
}
