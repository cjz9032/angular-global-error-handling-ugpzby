import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { ModalWifiSecuriryLocationNoticeComponent } from 'src/app/components/modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { ModalHomeProtectionLocationNoticeComponent } from 'src/app/components/modal/modal-home-protection-location-notice/modal-home-protection-location-notice.component';
import { EventTypes, WifiSecurity, ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { ModalErrorMessageComponent } from 'src/app/components/modal/modal-error-message/modal-error-message.component';
import { ModalLenovoIdComponent } from 'src/app/components/modal/modal-lenovo-id/modal-lenovo-id.component';
import { ModalCommonConfirmationComponent } from 'src/app/components/modal/modal-common-confirmation/modal-common-confirmation.component';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	constructor(private commonService: CommonService,
		public modalService: NgbModal)  { }

	wifiSecurityLocationDialog(wifiSecurity: WifiSecurity) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === true) {
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
			modal.componentInstance.closeButtonId = 'sa-ws-btn-locationClose';
			modal.componentInstance.agreeButtonId = 'sa-ws-btn-locationAgree';
			modal.componentInstance.cancelButtonId = 'sa-ws-btn-locationCancel';
			wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (para) => {
				if (para) {
					modal.close();
				}
			});
		}
	}

	wifiSecurityErrorMessageDialog() {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === true) {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			const showdialog = this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, true);
			if (showdialog) {
				this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, false);
				const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
					backdrop: 'static',
					size: 'lg',
					windowClass: 'wifi-security-error-modal'
				});
				errorMessageModal.componentInstance.header = 'security.wifisecurity.errorMessage.headerText';
				errorMessageModal.componentInstance.description = 'security.wifisecurity.errorMessage.bodyText';
				errorMessageModal.componentInstance.closeButtonId = 'sa-ws-btn-errorMessageDialogClose';
				errorMessageModal.componentInstance.cancelButtonId = 'sa-ws-btn-errorMessageDialogCansole';
			}
		}
	}

	homeProtectionOpenLocationDialog(wifiSecurity: WifiSecurity) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === true) {
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
			modal.componentInstance.closeButtonId = 'sa-ws-btn-locationclose';
			modal.componentInstance.agreeButtonId = 'sa-ws-btn-locationagree';
			modal.componentInstance.cancelButtonId = 'sa-ws-btn-locationcancel';
			wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (para) => {
				if (para) {
					modal.close();
				}
			});
		}
	}

	homeSecurityPluginMissingDialog() {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage) === true) {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
				backdrop: 'static',
				size: 'lg',
				windowClass: 'wifi-security-error-modal'
			});
			errorMessageModal.componentInstance.header = 'security.wifisecurity.errorMessage.headerText';
			errorMessageModal.componentInstance.description = 'security.wifisecurity.errorMessage.bodyText';
			errorMessageModal.componentInstance.closeButtonId = 'chs-btn-errorMessageDialogClose';
			errorMessageModal.componentInstance.cancelButtonId = 'chs-btn-errorMessageDialogCancle';
			errorMessageModal.result.then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'finish');
			});
		}
	}

	homeSecurityOfflineDialog() {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage) === true) {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
				backdrop: 'static',
				size: 'lg',
				windowClass: 'wifi-security-error-modal'
			});
			errorMessageModal.componentInstance.header = 'security.wifisecurity.errorMessage.headerText';
			errorMessageModal.componentInstance.description = 'security.wifisecurity.errorMessage.offlineText';
			errorMessageModal.componentInstance.closeButtonId = 'chs-btn-offlineDialogClose';
			errorMessageModal.componentInstance.cancelButtonId = 'chs-btn-offlineDialogcancle';
		}
	}

	// Popup Lenovo ID modal dialog
	lenovoIdDialog(appFeature = null) {
		return new Promise((resolve, reject) => {
			if (!navigator.onLine) {
				const modalRef = this.modalService.open(ModalCommonConfirmationComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'common-confirmation-modal'
				});

				const header = 'lenovoId.ssoErrorTitle';
				modalRef.componentInstance.CancelText = '';
				modalRef.componentInstance.header = header;
				modalRef.componentInstance.description = 'lenovoId.ssoErrorNetworkDisconnected';
				reject();
			} else {
				const modal: NgbModalRef = this.modalService.open(ModalLenovoIdComponent, {
					backdrop: 'static',
					centered: true,
					windowClass: 'lenovo-id-modal-size'
				});
				(<ModalLenovoIdComponent>modal.componentInstance).appFeature = appFeature;
				resolve();
			}
		});
	}

}
