import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

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
	@Input() logonStatus: string; // trail, trail expired, upgrate, upgrate expired, local account
	@Input() eventEmitter: EventEmitter<string>;
	deviceMoreThanTen: boolean;
	pluginAvailable = false;
	isShowBadge = true;


	testStatus: string;

	constructor(
		public shellService: VantageShellService
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
		if (this.devicesNumber === 0) {
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

	switchStatus() {
		if (!this.testStatus || this.testStatus === 'loading') {
			this.pluginAvailable = false;
		} else {
			if (this.testStatus === 'lessDevices-secure') {
				this.logonStatus = 'trail';
				this.devicesNumber = 7;
				this.devicesStatus = 'secure';
			} else if (this.testStatus === 'moreDevices-needAttention') {
				this.logonStatus = 'trail';
				this.devicesNumber = 99;
				this.devicesStatus = 'needs attention';
			} else if (this.testStatus === 'noneDevices') {
				this.logonStatus = 'trail';
				this.devicesNumber = 0;
				this.devicesStatus = 'secure';
			} else if (this.testStatus === 'tralExpired') {
				this.logonStatus = 'trail expired';
				this.devicesNumber = 0;
				this.devicesStatus = 'needs attention';
			} else if (this.testStatus === 'lessDevices-needAttention') {
				this.logonStatus = 'trail';
				this.devicesNumber = 7;
				this.devicesStatus = 'needs attention';
			} else {
				this.logonStatus = 'trail';
				this.devicesNumber = 100;
				this.devicesStatus = 'secure';
			}
			this.pluginAvailable = true;
			this.judgeDeviceNumber();
			this.showBadge();
		}
	}
}
