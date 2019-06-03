import { Component, OnInit, Input } from '@angular/core';
import { SecurityAdvisor, WifiSecurity } from '@lenovo/tan-client-bridge';
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
	deviceMoreThanTen: boolean;
	pluginAvailable = false;
	IsShowBadge = true;


	securityAdvisor: SecurityAdvisor;
	wifiSecurity: WifiSecurity;
	allDeviceWidgetStatus: number;

	constructor(
		public shellService: VantageShellService
	) {
		this.securityAdvisor = shellService.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.judgeDeviceNumber();
		this.wifiSecurity.on('switchStatus', (allDeviceWidgetStatus) => {
			this.allDeviceWidgetStatus = allDeviceWidgetStatus;
			this.switchStatus();
		});
	}

	ngOnInit() {
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
			this.IsShowBadge = false;
		}
	}

	openCornet() {
		window.open(this.homeSecurityUrl, '_blank');
	}

	openUpgrade() {
		window.open(this.upgradeUrl, '_blank');
	}

	switchStatus() {
		if (!this.allDeviceWidgetStatus || this.allDeviceWidgetStatus === 1) {
			this.pluginAvailable = false;
		} else if (this.allDeviceWidgetStatus === 2) {
			this.pluginAvailable = true;
			this.logonStatus = 'trail';
			this.devicesNumber = 7;
			this.devicesStatus = 'secure';
		} else if (this.allDeviceWidgetStatus === 3) {
			this.pluginAvailable = true;
			this.logonStatus = 'trail';
			this.devicesNumber = 99;
			this.judgeDeviceNumber();
			this.devicesStatus = 'needs attention';
		} else if (this.allDeviceWidgetStatus === 4) {
			this.pluginAvailable = true;
			this.logonStatus = 'trail';
			this.devicesNumber = 0;
			this.devicesStatus = 'secure';
		} else if (this.allDeviceWidgetStatus === 5) {
			this.pluginAvailable = true;
			this.logonStatus = 'trail expired';
			this.devicesNumber = 0;
			this.devicesStatus = 'needs attention';
		} else if (this.allDeviceWidgetStatus === 6) {
			this.pluginAvailable = true;
			this.logonStatus = 'trail';
			this.devicesNumber = 7;
			this.devicesStatus = 'needs attention';
		} else if (this.allDeviceWidgetStatus === 7) {
			this.pluginAvailable = true;
			this.logonStatus = 'trail';
			this.devicesNumber = 100;
			this.judgeDeviceNumber();
			this.devicesStatus = 'secure';
		} else {
			this.pluginAvailable = true;
			this.logonStatus = 'trail';
			this.devicesNumber = 0;
			this.showBadge();
			this.devicesStatus = 'secure';
		}
	}
}
