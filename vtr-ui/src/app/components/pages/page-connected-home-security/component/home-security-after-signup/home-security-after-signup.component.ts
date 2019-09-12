import { Component, OnInit, Input } from '@angular/core';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';
import { CHSAccountState } from '@lenovo/tan-client-bridge';

@Component({
  selector: 'vtr-home-security-after-signup',
  templateUrl: './home-security-after-signup.component.html',
  styleUrls: ['./home-security-after-signup.component.scss']
})
export class HomeSecurityAfterSignupComponent implements OnInit {
	@Input() allDevices: HomeSecurityAllDevice;
	@Input() account: HomeSecurityAccount;
	@Input() common: HomeSecurityCommon;
	overviewTitle: string;
	metricsParent = 'ConnectedHomeSecurity';
	constructor(
		public dialogService: DialogService
	) {	}

	ngOnInit() {
		if (this.account && this.account.role) {
			if (this.account.role === 'admin') {
				this.overviewTitle = 'homeSecurity.overview.overviewTitleAdmin';
			} else {
				this.overviewTitle = 'homeSecurity.overview.overviewTitleUser';
			}
		}
	}

	disconnect() {
		this.dialogService.homeSecurityTrialModal(2);
	}

	openCornet() {
		this.common.openCornet();
	}

	isMoreThen30Day(num: number): boolean {
		if (num > 30) {
			return true;
		} else {
			return false;
		}
	}

}
