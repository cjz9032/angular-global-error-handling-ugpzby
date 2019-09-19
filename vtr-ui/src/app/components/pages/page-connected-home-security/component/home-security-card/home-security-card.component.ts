import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { HomeSecurityLocation } from 'src/app/data-models/home-security/home-security-location.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CHSTrialModalPage } from 'src/app/enums/home-security-modal-trial-page.enum';

@Component({
	selector: 'vtr-home-security-card',
	templateUrl: './home-security-card.component.html',
	styleUrls: ['./home-security-card.component.scss']
})
export class HomeSecurityCardComponent implements OnInit {
	@Input() location: HomeSecurityLocation;
	@Input() permission: any;

	constructor(
		public dialogService: DialogService,
		private commonService: CommonService
	) {	}

	ngOnInit() {
	}

	joinGroup() {
		if (!this.commonService.isOnline) {
			this.dialogService.homeSecurityOfflineDialog();
		} else if (this.location && this.location.isLocationServiceOn) {
			this.dialogService.openInvitationCodeDialog();
		} else {
			this.isShowCHSPermissionDialog().then((result) => {
				if (result) {
					this.dialogService.openCHSPermissionModal();
				} else {
					this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
						if (status) {
							this.dialogService.openInvitationCodeDialog();
						}
					});
				}
			});
		}
	}

	openTrialModal() {
		if (!this.commonService.isOnline) {
			this.dialogService.homeSecurityOfflineDialog();
		} else if (this.location && this.location.isLocationServiceOn) {
			this.dialogService.homeSecurityTrialModal(CHSTrialModalPage.loading);
		} else {
			this.isShowCHSPermissionDialog().then((result) => {
				if (result) {
					this.dialogService.openCHSPermissionModal();
				} else {
					this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
						if (status) {
							this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
							this.dialogService.homeSecurityTrialModal(CHSTrialModalPage.loading);
						}
					});
				}
			});
		}
	}

	isShowCHSPermissionDialog(): Promise<boolean> {
		return this.permission.getSystemPermissionShowed().then((result) => {
			if (!result) {
				if (this.location && this.location.isDeviceServiceOn && this.location.isComputerServiceOn) {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		});
	}
}
