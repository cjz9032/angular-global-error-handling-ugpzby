import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { ModalWifiSecuriryLocationNoticeComponent } from 'src/app/components/modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { ModalHomeProtectionLocationNoticeComponent } from 'src/app/components/modal/modal-home-protection-location-notice/modal-home-protection-location-notice.component';
import { EventTypes, WifiSecurity } from '@lenovo/tan-client-bridge';
import { WifiHomeViewModel } from 'src/app/data-models/security-advisor/wifisecurity.model';

@Injectable({
	providedIn: 'root'
})
export class SecurityService {

	constructor(private commonService: CommonService,
		public modalService: NgbModal)  { }

	wifiSecurityLocationDialog(wifiSecurity: WifiSecurity) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === 'true') {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'no');
			const modal = this.modalService.open(ModalWifiSecuriryLocationNoticeComponent,
			{
				backdrop: 'static'
				, windowClass: 'wifi-security-location-modal'
			});
			modal.componentInstance.header = 'security.wifisecurity.locationmodal.title';
			modal.componentInstance.description = 'security.wifisecurity.locationmodal.describe1';
			modal.componentInstance.url = 'ms-settings:privacy-location';
			modal.componentInstance.wifiSecurity = wifiSecurity;
			wifiSecurity.on(EventTypes.geolocatorPermissionEvent, (para) => {
				if (para) {
					modal.close();
				}
			});
		}
	}

	homeProtectionOpenLocationDialog(wifiSecurity: WifiSecurity) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === 'true') {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			const modal = this.modalService.open(ModalHomeProtectionLocationNoticeComponent,
			{
				backdrop: 'static'
				, windowClass: 'wifi-security-location-modal'
			});
			modal.componentInstance.header = 'security.wifisecurity.locationmodal.title';
			modal.componentInstance.description = 'security.wifisecurity.locationmodal.describe2';
			modal.componentInstance.url = 'ms-settings:privacy-location';
			modal.componentInstance.wifiSecurity = wifiSecurity;
			wifiSecurity.on(EventTypes.geolocatorPermissionEvent, (para) => {
				if (para) {
					modal.close();
				}
			});
		}
	}
}
