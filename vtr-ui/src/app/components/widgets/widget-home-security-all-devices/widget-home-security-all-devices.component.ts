import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';
import { CommonService } from 'src/app/services/common/common.service';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { CHSAccountState } from '@lenovo/tan-client-bridge';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';

@Component({
	selector: 'vtr-widget-home-security-all-devices',
	templateUrl: './widget-home-security-all-devices.component.html',
	styleUrls: ['./widget-home-security-all-devices.component.scss']
})
export class WidgetHomeSecurityAllDevicesComponent implements OnInit {
	@Input() account: HomeSecurityAccount;
	@Input() allDevicesInfo: HomeSecurityAllDevice;
	@Input() eventEmitter: EventEmitter<string>;
	@Output() emitter = new EventEmitter();

	pluginAvailable = true;


	testStatus: string;

	constructor(
		public shellService: VantageShellService,
		public modalService: NgbModal,
		public userService: UserService,
		public commonService: CommonService,
	) {	}

	ngOnInit() {
		this.eventEmitter.subscribe((testStatus) => {
			this.testStatus = testStatus;
			this.switchStatus();
		});
		if (this.allDevicesInfo) {
			this.judgeDeviceNumber();
		}
	}

	judgeDeviceNumber() {
		if (this.allDevicesInfo.allDevicesNumber > 9) {
			if (this.allDevicesInfo.allDevicesNumber > 99) {
				this.allDevicesInfo.allDevicesNumber = 99;
			}
			return true;
		} else {
			return false;
		}
	}

	showBadge() {
		if (!this.account || !this.allDevicesInfo) {
			return false;
		} else if (this.allDevicesInfo.allDevicesNumber === 0 && this.account.state !== CHSAccountState.trialExpired && this.account.state !== CHSAccountState.local) {
			return false;
		} else {
			return true;
		}
	}

	openCornet() {
		this.emitter.emit('visitCornet');
	}

	openUpgrade() {
		this.emitter.emit('upgrade');
	}

	startTrial() {
		this.emitter.emit('startTrial');
	}

	switchStatus() {
		if (!this.testStatus || this.testStatus === 'loading') {
			this.pluginAvailable = false;
		} else {
			if (this.testStatus === 'lessDevices-secure') {
				this.account.state = CHSAccountState.trial;
				this.allDevicesInfo.allDevicesNumber = 7;
				this.allDevicesInfo.allDevicesStatus = true;
			} else if (this.testStatus === 'moreDevices-needAttention') {
				this.account.state = CHSAccountState.trial;
				this.allDevicesInfo.allDevicesNumber = 99;
				this.allDevicesInfo.allDevicesStatus = false;
			} else if (this.testStatus === 'noneDevices') {
				this.account.state = CHSAccountState.trial;
				this.allDevicesInfo.allDevicesNumber = 0;
				this.allDevicesInfo.allDevicesStatus = true;
			} else if (this.testStatus === 'trialExpired') {
				this.account.state = CHSAccountState.trialExpired;
				this.allDevicesInfo.allDevicesNumber = 0;
				this.allDevicesInfo.allDevicesStatus = false;
			} else if (this.testStatus === 'lessDevices-needAttention') {
				this.account.state = CHSAccountState.trial;
				this.allDevicesInfo.allDevicesNumber = 7;
				this.allDevicesInfo.allDevicesStatus = false;
			} else if (this.testStatus === 'moreDevices-secure') {
				this.account.state = CHSAccountState.trial;
				this.allDevicesInfo.allDevicesNumber = 100;
				this.allDevicesInfo.allDevicesStatus = true;
			} else {
				this.account.state = CHSAccountState.local;
				this.allDevicesInfo.allDevicesNumber = 0;
				this.allDevicesInfo.allDevicesStatus = false;
			}
			this.pluginAvailable = true;
		}
	}
}
