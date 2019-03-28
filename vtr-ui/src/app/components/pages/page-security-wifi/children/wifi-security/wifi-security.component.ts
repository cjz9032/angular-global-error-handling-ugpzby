import { Component, OnInit, Input } from '@angular/core';
import { WifiSecurity } from '@lenovo/tan-client-bridge';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWifiSecuriryLocationNoticeComponent } from '../../../../modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { ModalThreatLocatorComponent } from 'src/app/components/modal/modal-threat-locator/modal-threat-locator.component';
import { WifiHomeViewModel } from '../../page-security-wifi.component';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { BaseComponent } from '../../../../base/base.component';

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit {
	@Input() data: WifiHomeViewModel;
	isShowMore = true; // less info, more info
	isShowMoreLink = true; // show more link
	// showAllNetworks: boolean = true;
	isCollapsed = true;
	isWifiSecurityEnabled = true;
	showAllNetworks = true;
	showMore = false;

	constructor(
		public modalService: NgbModal
	) {
		super();
	}

	ngOnInit() {
		this.isWifiSecurityEnabled = false;

		this.data.wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
			if (!value) {
				const modal = this.modalService.open(ModalWifiSecuriryLocationNoticeComponent,
					{
						backdrop: 'static'
						, windowClass: 'wifi-security-location-modal'
					});
				modal.componentInstance.header = 'Enable location services';
				modal.componentInstance.description = 'To use Lenovo WiFi Security, you need to enable location services for Lenovo Vantage. Would you like to enable location now?';
				modal.componentInstance.url = 'ms-settings:privacy-location';
			}
		});
	}

	enableWifiSecurity(): void {
		try {
			if (this.data.wifiSecurity) {
				if (this.data.wifiSecurity.isLocationServiceOn) {
					this.data.wifiSecurity.enableWifiSecurity().then(() => {
						this.data.homeProtection.refresh();
					});
				} else {
					const modal = this.modalService.open(ModalWifiSecuriryLocationNoticeComponent,
						{
							backdrop: 'static'
							, windowClass: 'wifi-security-location-modal'
						});
					modal.componentInstance.header = 'Enable location services';
					modal.componentInstance.description = 'To use Lenovo WiFi Security, you need to enable location services for Lenovo Vantage. Would you like to enable location now?';
					modal.componentInstance.url = 'ms-settings:privacy-location';
					this.data.wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
						if (value) {
							modal.close();
						}
					});
				}
			}
		} catch {
			throw new Error('wifiSecurity is null');
		}
	}

	disableWifiSecurity(): void {
		try {
			if (this.data.wifiSecurity) {
				this.data.wifiSecurity.disableWifiSecurity();
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
			this.isShowMoreLink = true;
		} else if (length + 2 >= all_length || length + 2 >= 8) {
			this.data.historys = this.data.allHistorys.slice(0, 8);
			this.isShowMoreLink = false;
		} else {
			this.data.historys = this.data.allHistorys.slice(0, length + 2);
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
