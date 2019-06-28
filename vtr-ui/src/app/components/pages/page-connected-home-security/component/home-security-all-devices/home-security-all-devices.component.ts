import { Component, OnInit, Input } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';
import { CommonService } from 'src/app/services/common/common.service';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { CHSAccountState } from '@lenovo/tan-client-bridge';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';

@Component({
	selector: 'vtr-home-security-all-devices',
	templateUrl: './home-security-all-devices.component.html',
	styleUrls: ['./home-security-all-devices.component.scss']
})
export class HomeSecurityAllDevicesComponent implements OnInit {
	@Input() common: HomeSecurityCommon;
	@Input() account: HomeSecurityAccount;
	@Input() allDevicesInfo: HomeSecurityAllDevice;

	pluginAvailable = true;


	constructor(
		public shellService: VantageShellService,
		public modalService: NgbModal,
		public userService: UserService,
		public commonService: CommonService,
	) {	}

	ngOnInit() {
	}
}
