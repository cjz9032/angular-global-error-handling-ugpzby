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
	expirationDay: number;
	dialogService: DialogService;
	chs: any;

	constructor(
		dialogService: DialogService,
		private vantageShellService: VantageShellService,
		public homeSecurityMockService: HomeSecurityMockService
	) {
		this.dialogService = dialogService;
		if (!this.chs) {
			this.chs = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
	}

	ngOnInit() {
		this.expirationDay = this.chs.account.expirationDay;
	}

	switch(role) {
		if (role === 'user') {
			this.chs.account.role = 'admin';
			if (this.chs.account.state === CHSAccountState.trial) {
				this.chs.account.state = CHSAccountState.trialExpired;
				this.expirationDay = 0;
			} else if (this.chs.account.state === CHSAccountState.trialExpired) {
				this.chs.account.state = CHSAccountState.standard;
				this.expirationDay = 50;
			} else if (this.chs.account.state === CHSAccountState.standard && this.expirationDay === 50) {
				this.chs.account.state = CHSAccountState.standard;
				this.expirationDay = 30;
			} else if (this.chs.account.state === CHSAccountState.standard) {
				this.chs.account.state = CHSAccountState.standardExpired;
				this.expirationDay = 0;
			} else {
				this.chs.account.state = CHSAccountState.trial;
				this.expirationDay = 10;
			}
		} else {
			this.chs.account.role = 'user';
		}
	}

	disconnect() {
		this.dialogService.homeSecurityTrialModal(2);
	}

	openCornet(feature?: string) {
		this.chs.visitWebConsole(feature);
	}

	isMoreThen30(num: number): boolean {
		if (num > 30) {
			return true;
		} else {
			return false;
		}
	}

}
