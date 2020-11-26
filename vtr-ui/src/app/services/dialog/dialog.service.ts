import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { ModalWifiSecurityLocationNoticeComponent } from 'src/app/components/modal/modal-wifi-security-location-notice/modal-wifi-security-location-notice.component';
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
import { LocalCacheService } from '../local-cache/local-cache.service';
import { MaterialDialogComponent } from 'src/app/material/material-dialog/material-dialog.component';
import { MatDialog } from '@lenovo/material/dialog';
import { DialogData } from 'src/app/material/material-dialog/material-dialog.interface';
import { WifiSecurityService } from 'src/app/services/security/wifi-security.service';

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	constructor(
		private commonService: CommonService,
		public modalService: NgbModal,
		private router: Router,
		private userService: UserService,
		private localCacheService: LocalCacheService,
		private deviceService: DeviceService,
		private wifiSecurityService: WifiSecurityService,
		private dialog: MatDialog
	) {}

	openInvitationCodeDialog() {
		if (this.hasOpenDialog()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const modal = this.modalService.open(ModalWifiSecurityInvitationComponent, {
				backdrop: 'static',
				windowClass: 'wifi-security-invitation-modal',
				centered: true,
			});
		}
	}

	wifiSecurityLocationDialog(wifiSecurity: WifiSecurity) {
		if (this.hasOpenDialog()) {
			return;
		}
		if (
			this.commonService.getSessionStorageValue(
				SessionStorageKey.SecurityWifiSecurityInWifiPage
			) ||
			this.commonService.getSessionStorageValue(
				SessionStorageKey.SecurityWifiSecurityInGamingDashboard
			)
		) {
			this.commonService.setSessionStorageValue(
				SessionStorageKey.SecurityWifiSecurityLocationFlag,
				'no'
			);
			const modal = this.modalService.open(ModalWifiSecurityLocationNoticeComponent, {
				backdrop: 'static',
				windowClass: 'wifi-security-location-modal',
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
					modal.close(true);
				}
			});
			modal.result.then((res) => {
				if (res === 'cancelClick' && wifiSecurity && wifiSecurity.state === 'enabled') {
					wifiSecurity.disableWifiSecurity();
				}
			});
		}
	}

	wifiSecurityErrorMessageDialog() {
		if (this.hasOpenDialog()) {
			return;
		}
		if (
			this.commonService.getSessionStorageValue(
				SessionStorageKey.SecurityWifiSecurityInWifiPage
			)
		) {
			const showdialog = this.commonService.getSessionStorageValue(
				SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog,
				true
			);
			if (showdialog) {
				this.commonService.setSessionStorageValue(
					SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog,
					false
				);
				const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
					backdrop: 'static',
					size: 'lg',
					windowClass: 'wifi-security-error-modal',
				});
				errorMessageModal.componentInstance.header =
					'security.wifisecurity.errorMessage.headerText';
				errorMessageModal.componentInstance.description =
					'security.wifisecurity.errorMessage.bodyText';
				errorMessageModal.componentInstance.closeButtonId =
					'sa-ws-btn-errorMessageDialogClose';
				errorMessageModal.componentInstance.cancelButtonId =
					'sa-ws-btn-errorMessageDialogCansole';
			}
		}
	}

	homeProtectionOpenLocationDialog(wifiSecurity: WifiSecurity) {
		if (this.hasOpenDialog()) {
			return;
		}
		if (
			this.commonService.getSessionStorageValue(
				SessionStorageKey.SecurityWifiSecurityInWifiPage
			)
		) {
			const modal = this.modalService.open(ModalHomeProtectionLocationNoticeComponent, {
				backdrop: 'static',
				windowClass: 'wifi-security-location-modal',
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
		if (this.hasOpenDialog()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'home-security-plugin-missing-modal',
			});
			errorMessageModal.componentInstance.header =
				'security.wifisecurity.errorMessage.headerText';
			errorMessageModal.componentInstance.description =
				'security.wifisecurity.errorMessage.bodyText';
			errorMessageModal.componentInstance.closeButtonId = 'chs-btn-errorMessageDialogClose';
			errorMessageModal.componentInstance.cancelButtonId = 'chs-btn-errorMessageDialogCancle';
			errorMessageModal.result.then(() => {
				this.commonService.setSessionStorageValue(
					SessionStorageKey.HomeSecurityShowPluginMissingDialog,
					'finish'
				);
			});
		}
	}

	homeSecurityOfflineDialog() {
		if (this.hasOpenDialog()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'home-security-offline-modal',
			});
			errorMessageModal.componentInstance.header =
				'security.wifisecurity.errorMessage.headerText';
			errorMessageModal.componentInstance.description =
				'security.wifisecurity.errorMessage.offlineText';
			errorMessageModal.componentInstance.closeButtonId = 'chs-btn-offlineDialogClose';
			errorMessageModal.componentInstance.cancelButtonId = 'chs-btn-offlineDialogcancle';
		}
	}

	homeSecurityAccountDialog() {
		if (this.hasOpenDialog()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const errorMessageModal = this.modalService.open(ModalErrorMessageComponent, {
				backdrop: 'static',
				size: 'lg',
				windowClass: 'home-security-error-modal',
			});
			errorMessageModal.componentInstance.header =
				'security.wifisecurity.errorMessage.headerText';
			errorMessageModal.componentInstance.description =
				'security.wifisecurity.errorMessage.accountText';
			errorMessageModal.componentInstance.closeButtonId = 'chs-btn-accountDialogClose';
			errorMessageModal.componentInstance.cancelButtonId = 'chs-btn-accountDialogcancle';
		}
	}

	openCHSPermissionModal(locationPermission: DeviceLocationPermission): NgbModalRef {
		if (this.hasOpenDialog()) {
			return;
		}
		if (
			this.commonService.getSessionStorageValue(
				SessionStorageKey.HomeProtectionInCHSPage,
				false
			)
		) {
			this.commonService.setSessionStorageValue(
				SessionStorageKey.ChsLocationDialogNextShowFlag,
				false
			);
			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'Welcome-container-Modal',
			});
			welcomeModal.componentInstance.locationPermission = locationPermission;
			welcomeModal.componentInstance.switchPage = 2;
			return welcomeModal;
		}
	}

	openWelcomeModal(
		showWelcome: number,
		locationPermission: DeviceLocationPermission
	): NgbModalRef {
		if (this.hasOpenDialog()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ConnectedHomeSecurityShowWelcome,
				showWelcome + 1
			);

			if (showWelcome === 1) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.ConnectedHomeSecurityWelcomeComplete,
					true
				);
			}

			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'Welcome-container-Modal',
			});
			welcomeModal.componentInstance.locationPermission = locationPermission;
			return welcomeModal;
		}
	}

	homeSecurityTrialModal(showWhichPage: CHSTrialModalPage): NgbModalRef {
		if (this.hasOpenDialog()) {
			return;
		}
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			const trialModal = this.modalService.open(ModalChsStartTrialContainerComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'trial-container-Modal',
			});
			trialModal.componentInstance.showWhichPage = showWhichPage;
			return trialModal;
		}
	}

	openLenovoIdDialog(appFeature = null) {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LocalInfoSegment
		);
		if (segment && segment !== SegmentConst.Commercial) {
			if (!navigator.onLine) {
				const modalRef = this.modalService.open(ModalCommonConfirmationComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'common-confirmation-modal',
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
					windowClass: 'lenovo-id-modal-size',
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
		if (this.hasOpenDialog()) {
			return;
		}
		const modernPreloadModal: NgbModalRef = this.modalService.open(
			ModalModernPreloadComponent,
			{
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
				},
			}
		);
	}

	openWifiSecurityExpirePromptDialog(dialogData: DialogData, hadExpired: boolean) {
		if (this.hasOpenDialog()) {
			return;
		}
		const dialogRef = this.dialog.open(MaterialDialogComponent, {
			maxWidth: '50rem',
			data: {
				title: dialogData.title,
				description: dialogData.description,
				buttonName: dialogData.buttonName,
				linkButtonName: dialogData.linkButtonName,
				showCloseButton: dialogData.showCloseButton,
			},
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			backdropClass: 'dialogBackdropExcludeMenu',
			panelClass: [this.deviceService.isGaming ? 'is-gaming' : '', 'm-5', 'h-auto'],
			id: 'wifi-security-expire-prompt-dialog',
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result === 'action') {
				this.openLenovoIdDialog().then((res) => {
					if (res === 'User close' && hadExpired) {
						if (
							this.wifiSecurityService.isLWSEnabled &&
							!this.userService.auth &&
							this.userService.isLenovoIdSupported()
						) {
							this.openWifiSecurityExpirePromptDialog(dialogData, hadExpired);
						}
					}
				});
			}
		});
	}

	hasOpenDialog() {
		return this.dialog.openDialogs.length || this.modalService.hasOpenModals();
	}

	closeDialog(id: string) {
		if (this.dialog.getDialogById(id)) {
			this.dialog.getDialogById(id).close();
			this.dialog.openDialogs.splice(0, this.dialog.openDialogs.length);
		}
	}
}
