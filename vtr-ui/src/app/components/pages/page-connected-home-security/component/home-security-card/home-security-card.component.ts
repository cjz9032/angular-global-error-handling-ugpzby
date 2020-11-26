import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { DeviceLocationPermission } from 'src/app/data-models/home-security/device-location-permission.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CHSTrialModalPage } from 'src/app/enums/home-security-modal-trial-page.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-home-security-card',
	templateUrl: './home-security-card.component.html',
	styleUrls: ['./home-security-card.component.scss'],
})
export class HomeSecurityCardComponent implements OnInit {
	@Input() location: DeviceLocationPermission;
	@Input() permission: any;

	constructor(
		public dialogService: DialogService,
		private localCacheService: LocalCacheService,
		private commonService: CommonService
	) {}

	ngOnInit() {}

	joinGroup() {
		if (!this.commonService.isOnline) {
			this.dialogService.homeSecurityOfflineDialog();
		} else if (this.location && this.location.isLocationServiceOn) {
			this.dialogService.openInvitationCodeDialog();
		} else {
			this.showPermissionDialog('join');
		}
	}

	openTrialModal() {
		if (!this.commonService.isOnline) {
			this.dialogService.homeSecurityOfflineDialog();
		} else if (this.location && this.location.isLocationServiceOn) {
			this.dialogService.homeSecurityTrialModal(CHSTrialModalPage.loading);
		} else {
			this.showPermissionDialog('trial');
		}
	}

	showPermissionDialog(dialog: string) {
		if (
			this.location &&
			!this.location.hasSystemPermissionShowed &&
			this.location.isAllAppsServiceOn &&
			this.location.isDeviceServiceOn
		) {
			this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
				if (status) {
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.ConnectedHomeSecurityWelcomeComplete,
						true
					);
					if (dialog === 'join') {
						this.dialogService.openInvitationCodeDialog();
					} else if (dialog === 'trial') {
						this.dialogService.homeSecurityTrialModal(CHSTrialModalPage.loading);
					}
				}
			});
		} else {
			this.dialogService.openCHSPermissionModal(this.location);
		}
	}
}
