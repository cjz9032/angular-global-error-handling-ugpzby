import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';
import { CommonService } from 'src/app/services/common/common.service';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { CHSAccountState, ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { ModalLenovoIdComponent } from '../../modal/modal-lenovo-id/modal-lenovo-id.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';

@Component({
	selector: 'vtr-widget-home-security-all-devices',
	templateUrl: './widget-home-security-all-devices.component.html',
	styleUrls: ['./widget-home-security-all-devices.component.scss']
})
export class WidgetHomeSecurityAllDevicesComponent implements OnInit {
	@Input() connectedHomeSecurity: ConnectedHomeSecurity;
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
		if (this.allDevicesInfo) {
			this.judgeDeviceNumber();
		}
	}

	judgeDeviceNumber() {
		if (this.account && this.account.state && (this.account.state === CHSAccountState.trialExpired || this.account.state === CHSAccountState.local)) {
			this.allDevicesInfo.allDevicesNumber = 0;
		}
		if (this.allDevicesInfo.allDevicesNumber > 9) {
			if (this.allDevicesInfo.allDevicesNumber > 99) {
				this.allDevicesInfo.allDevicesNumber = 99;
			}
			return true;
		}
			return false;
	}

	openCornet(feature?: string) {
		this.connectedHomeSecurity.account.visitWebConsole(feature);
	}

	openUpgrade() {
		this.connectedHomeSecurity.account.purchase();
	}

	startTrial() {
		if (this.account.lenovoIdLoggedIn) {
			this.connectedHomeSecurity.account.createAccount();
		} else {
			this.modalService.open(ModalLenovoIdComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'lenovo-id-modal-size'
			});
			this.commonService.notification.subscribe((notification: AppNotification) => {
				if (notification && notification.type === LenovoIdStatus.SignedIn) {
					this.connectedHomeSecurity.account.createAccount();
				}
			});
		}
	}
}
