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
import { SegmentConst } from '../self-select/self-select.service';
import { ModalCommonConfirmationComponent } from 'src/app/components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { ModalLenovoIdComponent } from 'src/app/components/modal/modal-lenovo-id/modal-lenovo-id.component';
import { ModalModernPreloadComponent } from 'src/app/components/modal/modal-modern-preload/modal-modern-preload.component';
import { Router } from '@angular/router';
import { DeviceService } from '../device/device.service';
import { DeviceLocationPermission } from 'src/app/data-models/home-security/device-location-permission.model';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	constructor(
		private commonService: CommonService,
		public modalService: NgbModal,
		private router: Router,
		private userService: UserService,
		private deviceService: DeviceService
	)  { }

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
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) || this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInGamingDashboard)) {
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
			// modal.componentInstance.closeButtonId = 'sa-ws-btn-locationclose';
			// modal.componentInstance.agreeButtonId = 'sa-ws-btn-locationagree';
			// modal.componentInstance.cancelButtonId = 'sa-ws-btn-locationcancel';
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

	openCHSPermissionModal(locationPermission: DeviceLocationPermission): NgbModalRef {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, false)) {
			this.commonService.setSessionStorageValue(SessionStorageKey.ChsLocationDialogNextShowFlag, false);
			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			welcomeModal.componentInstance.locationPermission = locationPermission;
			welcomeModal.componentInstance.switchPage = 2;
			return welcomeModal;
		}
	}

	openWelcomeModal(showWelcome: number, locationPermission: DeviceLocationPermission): NgbModalRef {
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
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			welcomeModal.componentInstance.locationPermission = locationPermission;
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

	openLenovoIdDialog(appFeature = null) {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		const segment: SegmentConst = this.commonService.getLocalStorageValue(LocalStorageKey.LocalInfoSegment);
		if (segment && segment !== SegmentConst.Commercial) {
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
				return modalRef.result;
			} else {
				const modalRef: NgbModalRef = this.modalService.open(ModalLenovoIdComponent, {
					backdrop: 'static',
					centered: true,
					windowClass: 'lenovo-id-modal-size'
				});
				modalRef.componentInstance.appFeature = appFeature;
				modalRef.result.catch((reason) => {
					if (typeof reason === 'number') {
						this.userService.popupErrorMessage(reason);
					}
				});
				return modalRef.result;
			}
		} else {
			this.router.parseUrl(this.deviceService.isGaming ? '/device-gaming' : '/dashboard');
		}
	}

	openModernPreloadModal() {
		// const segment: SegmentConst = this.commonService.getLocalStorageValue(LocalStorageKey.LocalInfoSegment);
		// if (segment && segment !== SegmentConst.Gaming && !this.deviceService.isSMode) {
			const modernPreloadModal: NgbModalRef = this.modalService.open(ModalModernPreloadComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'modern-preload-modal',
				keyboard: false,
				beforeDismiss: () => {
					if (modernPreloadModal.componentInstance.onBeforeDismiss) {
						modernPreloadModal.componentInstance.onBeforeDismiss();
					}
					return true;
				}
			});
		// } else {
		// 	this.router.parseUrl(this.deviceService.isGaming ? '/gaming/dashboard' : '/dashboard');
		// }
	}
}
