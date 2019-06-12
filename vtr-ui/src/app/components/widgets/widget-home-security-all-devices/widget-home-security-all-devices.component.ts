import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ModalLenovoIdComponent } from '../../modal/modal-lenovo-id/modal-lenovo-id.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';

@Component({
	selector: 'vtr-widget-home-security-all-devices',
	templateUrl: './widget-home-security-all-devices.component.html',
	styleUrls: ['./widget-home-security-all-devices.component.scss']
})
export class WidgetHomeSecurityAllDevicesComponent implements OnInit {
	@Input() allDevicesPageStatus: boolean;
	@Input() devicesNumber = 7;
	@Input() homeSecurityUrl = 'https://homesecurity.coro.net/';
	@Input() upgradeUrl = 'https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows';
	@Input() devicesStatus: string; // secure, needs attention
	@Input() logonStatus: string; // trial, trial expired, upgrate, upgrate expired, local account
	@Input() eventEmitter: EventEmitter<string>;
	deviceMoreThanTen: boolean;
	pluginAvailable = false;
	isShowBadge = true;


	testStatus: string;

	constructor(
		public shellService: VantageShellService,
		public modalService: NgbModal,
		public userService: UserService,
		public commonService: CommonService,
	) {
		this.judgeDeviceNumber();
	}

	ngOnInit() {
		this.eventEmitter.subscribe((testStatus) => {
			this.testStatus = testStatus;
			this.switchStatus();
		});
	}

	judgeDeviceNumber() {
		if (this.devicesNumber > 9) {
			this.deviceMoreThanTen = true;
			if (this.devicesNumber > 99) {
				this.devicesNumber = 99;
			}
		} else {
			this.deviceMoreThanTen = false;
		}
	}

	showBadge() {
		if (this.devicesNumber === 0 && this.logonStatus !== 'trial expired' && this.logonStatus !== 'local account') {
			this.isShowBadge = false;
		} else {
			this.isShowBadge = true;
		}
	}

	openCornet() {
		window.open(this.homeSecurityUrl, '_blank');
	}

	openUpgrade() {
		window.open(this.upgradeUrl, '_blank');
	}

	startTrial() {
		if (this.userService.auth) {
			this.cornetStartTrial();
		} else {
			this.launchLenovoId();
		}
	}

	cornetStartTrial() {
		this.pluginAvailable = true;
		this.logonStatus = 'trial';
		this.devicesNumber = 0;
		this.devicesStatus = 'secure';
	}

	launchLenovoId() {
		this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'lenovo-id-modal-size'
		});
		this.commonService.notification.subscribe((notification: AppNotification) => {
			if (notification && notification.type === LenovoIdStatus.SignedIn) {
				this.cornetStartTrial();
			}
		});
	}

	switchStatus() {
		if (!this.testStatus || this.testStatus === 'loading') {
			this.pluginAvailable = false;
		} else {
			if (this.testStatus === 'lessDevices-secure') {
				this.logonStatus = 'trial';
				this.devicesNumber = 7;
				this.devicesStatus = 'secure';
			} else if (this.testStatus === 'moreDevices-needAttention') {
				this.logonStatus = 'trial';
				this.devicesNumber = 99;
				this.devicesStatus = 'needs attention';
			} else if (this.testStatus === 'noneDevices') {
				this.logonStatus = 'trial';
				this.devicesNumber = 0;
				this.devicesStatus = 'secure';
			} else if (this.testStatus === 'trialExpired') {
				this.logonStatus = 'trial expired';
				this.devicesNumber = 0;
				this.devicesStatus = 'needs attention';
			} else if (this.testStatus === 'lessDevices-needAttention') {
				this.logonStatus = 'trial';
				this.devicesNumber = 7;
				this.devicesStatus = 'needs attention';
			} else if (this.testStatus === 'moreDevices-secure') {
				this.logonStatus = 'trial';
				this.devicesNumber = 100;
				this.devicesStatus = 'secure';
			} else {
				this.logonStatus = 'local account';
				this.devicesNumber = 0;
				this.devicesStatus = 'needs attention';
			}
			this.pluginAvailable = true;
			this.judgeDeviceNumber();
			this.showBadge();
		}
	}
}
