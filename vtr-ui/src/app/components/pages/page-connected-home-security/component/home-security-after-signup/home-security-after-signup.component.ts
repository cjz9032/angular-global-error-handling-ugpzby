import { Component, OnInit, Input } from '@angular/core';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { CHSTrialModalPage } from 'src/app/enums/home-security-modal-trial-page.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceLocationPermission } from 'src/app/data-models/home-security/device-location-permission.model';

@Component({
  selector: 'vtr-home-security-after-signup',
  templateUrl: './home-security-after-signup.component.html',
  styleUrls: ['./home-security-after-signup.component.scss']
})
export class HomeSecurityAfterSignupComponent implements OnInit {
	@Input() allDevices: HomeSecurityAllDevice;
	@Input() account: HomeSecurityAccount;
	@Input() common: HomeSecurityCommon;
	@Input() location: DeviceLocationPermission;

	metricsParent = 'ConnectedHomeSecurity';
	constructor(
		public dialogService: DialogService,
		private commonService: CommonService
	) {	}

	ngOnInit() {	}

	disconnect() {
		if (!this.commonService.isOnline) {
			this.dialogService.homeSecurityOfflineDialog();
		} else if (this.location && this.location.isLocationServiceOn) {
			this.dialogService.homeSecurityTrialModal(CHSTrialModalPage.disconnect);
		} else {
			this.dialogService.openCHSPermissionModal(this.location);
		}
	}

	isMoreThen30Day(num: number): boolean {
		if (num > 30) {
			return true;
		} else {
			return false;
		}
	}

}
