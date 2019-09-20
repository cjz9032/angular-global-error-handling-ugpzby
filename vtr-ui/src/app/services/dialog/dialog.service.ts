import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { ModalWifiSecuriryLocationNoticeComponent } from 'src/app/components/modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { ModalHomeProtectionLocationNoticeComponent } from 'src/app/components/modal/modal-home-protection-location-notice/modal-home-protection-location-notice.component';
import { EventTypes, WifiSecurity } from '@lenovo/tan-client-bridge';
import { ModalErrorMessageComponent } from 'src/app/components/modal/modal-error-message/modal-error-message.component';
import { ModalChsWelcomeContainerComponent } from 'src/app/components/pages/page-connected-home-security/component/modal-chs-welcome-container/modal-chs-welcome-container.component';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { ModalWifiSecurityInvitationComponent } from 'src/app/components/modal/modal-wifi-security-invitation/modal-wifi-security-invitation.component';
import { ModalChsStartTrialContainerComponent } from 'src/app/components/pages/page-connected-home-security/component/modal-chs-start-trial-container/modal-chs-start-trial-container.component';
import { CHSTrialModalPage } from 'src/app/enums/home-security-modal-trial-page.enum';


@Injectable({
	providedIn: 'root'
})
export class DialogService {
	constructor(
		private commonService: CommonService,
		public modalService: NgbModal)  { }

	openInvitationCodeDialog() {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const modal = this.modalService.open(ModalWifiSecurityInvitationComponent,
			{
				backdrop: 'static',
				windowClass: 'wifi-security-location-modal',
				centered: true
			});
		}
	}

	wifiSecurityLocationDialog(wifiSecurity: WifiSecurity) {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage)) {
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
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage)) {
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
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage)) {
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
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'home-security-plugin-missing-modal'
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
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'home-security-offline-modal'
			});
			errorMessageModal.componentInstance.header = 'security.wifisecurity.errorMessage.headerText';
			errorMessageModal.componentInstance.description = 'security.wifisecurity.errorMessage.offlineText';
			errorMessageModal.componentInstance.closeButtonId = 'chs-btn-offlineDialogClose';
			errorMessageModal.componentInstance.cancelButtonId = 'chs-btn-offlineDialogcancle';
		}
	}

	homeSecurityAccountDialog() {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
				backdrop: 'static',
				size: 'lg',
				windowClass: 'home-security-error-modal'
			});
			errorMessageModal.componentInstance.header = 'security.wifisecurity.errorMessage.headerText';
			errorMessageModal.componentInstance.description = 'security.wifisecurity.errorMessage.accountText';
			errorMessageModal.componentInstance.closeButtonId = 'chs-btn-accountDialogClose';
			errorMessageModal.componentInstance.cancelButtonId = 'chs-btn-accountDialogcancle';
		}
	}

	openCHSPermissionModal(): NgbModalRef {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, false)) {
			this.commonService.setSessionStorageValue(SessionStorageKey.ChsLocationDialogNextShowFlag, false);
			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			welcomeModal.componentInstance.switchPage = 2;
			return welcomeModal;
		}
	}

	openWelcomeModal(showWelcome): NgbModalRef {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, showWelcome + 1);

			if (showWelcome === 1) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			}

			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			return welcomeModal;
		}
	}

	homeSecurityTrialModal(showWhichPage: CHSTrialModalPage): NgbModalRef {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {

			const trialModal = this.modalService.open(ModalChsStartTrialContainerComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'trial-container-Modal'
			});
			trialModal.componentInstance.showWhichPage = showWhichPage;
			return trialModal;
		}
	}
}
