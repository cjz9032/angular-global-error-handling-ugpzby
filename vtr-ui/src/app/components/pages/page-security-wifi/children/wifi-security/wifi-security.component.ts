import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalThreatLocatorComponent } from 'src/app/components/modal/modal-threat-locator/modal-threat-locator.component';
import { WifiHomeViewModel } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { BaseComponent } from '../../../../base/base.component';
import { CommonService } from 'src/app/services/common/common.service';
import { RegionService } from 'src/app/services/region/region.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { SecurityService } from 'src/app/services/security/security.service';

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit {
	@Input() data: WifiHomeViewModel;
	@Input() wifiIsShowMore: string;
	isShowMore = true; // less info, more info
	isShowMoreLink = true; // show more link
	region: string;
	isCollapsed = true;
	isWifiSecurityEnabled = true;
	showAllNetworks = true;
	showMore = false;
	hasMore: boolean;

	constructor(
		public modalService: NgbModal,
		private commonService: CommonService,
		public regionService: RegionService,
		private securityService: SecurityService
	) {
		super();
		// if (typeof Windows !== undefined) {
		// 	if (Windows.System.UserProfile.GlobalizationPreferences.homeGeographicRegion === 'CN') {
		// 		this.isThreatLocatorExist = false;
		// 	} else {
		// 		this.isThreatLocatorExist = true;
		// 	}
		// }
	}

	ngOnInit() {
		this.regionService.getRegion().subscribe({
			next: x => { this.region = x; },
			error: err => { console.error(err); },
			complete: () => { console.log('Done'); }
		});
		if (this.wifiIsShowMore === 'false') {
			this.isShowMore = false;
		}
		// this.data.wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
		this.data.wifiSecurity.on(EventTypes.geolocatorPermissionEvent, (value) => {
			if (!value && this.data.wifiSecurity.state === 'enabled') {
				this.securityService.wifiSecurityLocationDialog(this.data.wifiSecurity);
			} else if (value) {
				if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag) === 'yes') {
					this.data.wifiSecurity.enableWifiSecurity().then((res) => {
						if (res === true) {
							this.data.isLWSEnabled = true;
						} else {
							this.data.isLWSEnabled = false;
						}
					}, (error) => {
						console.log('no permission');
					});
				}
			}
		});
	}

	enableWifiSecurity(): void {
		try {
			if (this.data.wifiSecurity) {
				this.data.wifiSecurity.enableWifiSecurity().then((res) => {
					if (res === true) {
						this.data.isLWSEnabled = true;
					} else {
						this.data.isLWSEnabled = false;
					}
					this.data.homeProtection.refresh();
				}, (error) => {
					this.securityService.wifiSecurityLocationDialog(this.data.wifiSecurity);
				});
			}
		} catch {
			throw new Error('wifiSecurity is null');
		}
	}

	disableWifiSecurity(): void {
		try {
			if (this.data.wifiSecurity) {
				this.data.wifiSecurity.disableWifiSecurity().then((res) => {
					if (res === true) {
						this.data.isLWSEnabled = false;
					} else {
						this.data.isLWSEnabled = true;
					}
				});
				// this.wifiHomeViewModel.isLWSEnabled = (this.wifiHomeViewModel.wifiSecurity.state === 'enabled');
			}
		} catch {
			throw new Error('wifiSecurity is null');
		}
	}

	clickShowMore(): boolean {
		const length = this.data.historys.length;
		const all_length = this.data.allHistorys.length;
		if (length === all_length || length === 8) {
			this.data.historys = this.data.allHistorys.slice(0, 4);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
			this.isShowMoreLink = true;
		} else if (length + 2 >= all_length || length + 2 >= 8) {
			this.data.historys = this.data.allHistorys.slice(0, 8);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 8);
			this.isShowMoreLink = false;
		} else {
			this.data.historys = this.data.allHistorys.slice(0, length + 2);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, length + 2);
		}
		return false;
	}

	openThreatLocator() {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalThreatLocatorComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Threat-Locator-Modal'
		});
	}
}
