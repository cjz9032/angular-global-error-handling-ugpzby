import { Component, OnInit, Input } from '@angular/core';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';

@Component({
  selector: 'vtr-home-security-after-signup',
  templateUrl: './home-security-after-signup.component.html',
  styleUrls: ['./home-security-after-signup.component.scss']
})
export class HomeSecurityAfterSignupComponent implements OnInit {
	@Input() role: string;
	@Input() lenovoID: string;
	@Input() allDevices: HomeSecurityAllDevice;
	@Input() account: HomeSecurityAccount;
	@Input() common: HomeSecurityCommon;
	dialogService: DialogService;
	chs: ConnectedHomeSecurity;

	constructor(
		dialogService: DialogService,
		private vantageShellService: VantageShellService,
		public homeSecurityMockService: HomeSecurityMockService
	) {
		this.dialogService = dialogService;
		this.chs = vantageShellService.getConnectedHomeSecurity();
		if (!this.chs) {
			this.chs = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
	}

	ngOnInit() {
		this.role = 'admin';
	}

	switch(role) {
		if (role === 'user') {
			this.role = 'admin';
		} else {
			this.role = 'user';
		}
	}

	disconnect() {
		this.dialogService.homeSecurityTrialModal(2);
	}

	openCornet(feature?: string) {
		this.chs.visitWebConsole(feature);
	}

}
