// this is for extending the wifisecurity feature of Phoenix
// Not support injectable
import { SecurityAdvisorNotifications } from 'src/app/enums/security-advisor-notifications.enum';
import { CommonService } from '../common/common.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import { Emitable } from '@lenovo/tan-client-bridge/type/base';

export class WifisecurityProxy implements phoenix.WifiSecurity {

	private wifisecurity: phoenix.WifiSecurity;
	private commonService: CommonService;

	constructor(originWifiSecurity: any, commonService: CommonService) {
		this.wifisecurity = originWifiSecurity;
		this.commonService = commonService;
		this.on(phoenix.EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHandler.bind(this));
	}
	_mitt: mitt.Emitter;
	get mitt(): mitt.Emitter { return this.wifisecurity.mitt };
	set mitt(value: mitt.Emitter) { this.wifisecurity.mitt = value };

	_state: string;
	get state(): string { return this.wifisecurity.state };
	set state(value: string) { this.wifisecurity.state = value };

	_wifiHistory: phoenix.WifiDetail[];
	get wifiHistory(): phoenix.WifiDetail[] { return this.wifisecurity.wifiHistory };
	set wifiHistory(value: phoenix.WifiDetail[]) { this.wifisecurity.wifiHistory = value };

	_isLocationServiceOn: boolean;
	get isLocationServiceOn(): boolean { return this.wifisecurity.isLocationServiceOn };
	set isLocationServiceOn(value: boolean) { this.wifisecurity.isLocationServiceOn = value };

	_isLWSPluginInstalled: boolean;
	get isLWSPluginInstalled(): boolean { return this.isLWSPluginInstalled };
	set isLWSPluginInstalled(value: boolean) { this.isLWSPluginInstalled = value; }

	_hasSystemPermissionShowed: boolean;
	get hasSystemPermissionShowed(): boolean { return this.wifisecurity.hasSystemPermissionShowed };
	set hasSystemPermissionShowed(value: boolean) { this.hasSystemPermissionShowed = value };

	_isDevicePermissionOn: boolean;
	get isDevicePermissionOn(): boolean { return this.wifisecurity.isDevicePermissionOn };
	set isDevicePermissionOn(value: boolean) { this.isDevicePermissionOn = value; }

	_isAllAppsPermissionOn: boolean;
	get isAllAppsPermissionOn(): boolean { return this.wifisecurity.isAllAppsPermissionOn };
	set isAllAppsPermissionOn(value: boolean) { this.isAllAppsPermissionOn = value };

	_isSupported: boolean;
	get isSupported(): boolean { return this.wifisecurity.isSupported };
	set isSupported(value: boolean) { this.isSupported = value };

	_changeWifiSecurity: boolean;
	get changeWifiSecurity(): boolean { return this.wifisecurity.changeWifiSecurity };
	set changeWifiSecurity(value: boolean) { this.changeWifiSecurity = value };

	launchLocationPrivacy(): Promise<boolean> {
		return this.wifisecurity.launchLocationPrivacy();
	}
	enableWifiSecurity(): Promise<boolean> {
		return this.wifisecurity.enableWifiSecurity().then(ret => {
			if (ret) {
				this.commonService.sendNotification(SecurityAdvisorNotifications.WifiSecurityTurnedOn);
			}
			return ret;
		}, rej => rej);
	}
	disableWifiSecurity(): Promise<boolean> {
		return this.wifisecurity.disableWifiSecurity();
	}
	getWifiSecurityStateOnce(): Promise<any> {
		return this.wifisecurity.getWifiSecurityStateOnce();
	}
	updateWifiSecurityState(res: phoenix.WifiSecurity): void {
		return this.wifisecurity.updateWifiSecurityState(res);
	}
	getWifiSecurityState(): void {
		return this.wifisecurity.getWifiSecurityState();
	}
	getWifiState(): Promise<boolean> {
		return this.wifisecurity.getWifiState();
	}
	cancelGetWifiSecurityState(): void {
		return this.wifisecurity.cancelGetWifiSecurityState();
	}
	getWifiHistory(): void {
		return this.wifisecurity.getWifiHistory();
	}
	cancelGetWifiHistory(): void {
		return this.wifisecurity.cancelGetWifiHistory();
	}
	on(type: string, handler: (value: any, type?: any) => void): Emitable {
		return this.wifisecurity.on(type, handler);
	}
	off(type: string, handler: (value: any, type?: any) => void): Emitable {
		return this.wifisecurity.off(type, handler);
	}
	refresh(): Promise<any> {
		return this.wifisecurity.refresh();
	}

	wsIsLocationServiceOnEventHandler(value) {
		if (this.state === 'enabled' && value) {
			this.commonService.sendNotification(SecurityAdvisorNotifications.WifiSecurityTurnedOn);
		}
	}

}
