import { Component, OnInit, Input } from '@angular/core';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';

@Component({
  selector: 'vtr-home-security-after-signup',
  templateUrl: './home-security-after-signup.component.html',
  styleUrls: ['./home-security-after-signup.component.scss']
})
export class HomeSecurityAfterSignupComponent implements OnInit {
	// mock start
	@Input() role: string;
	@Input() lenovoID: string;
	@Input() allDevices: HomeSecurityAllDevice;
	@Input() account: HomeSecurityAccount;
	@Input() common: HomeSecurityCommon;
	// mock end

	constructor( ) {	}

	ngOnInit() {
		// mock start
		this.role = 'admin';
		this.account.expiration = new Date();
		this.account.standardTime = new Date();
		this.lenovoID = 'lenovo@lenovo.com';
		// mock end

	}
	switch(role) {
		this.account.expiration = new Date();
		this.account.standardTime = new Date();
		if (role === 'user') {
			this.role = 'admin';
		} else {
			this.role = 'user';
		}
	}

}
