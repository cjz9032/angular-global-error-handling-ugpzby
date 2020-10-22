// this is for extending the wifisecurity feature of Phoenix
// Not support injectable
import { Emitter } from 'mitt';
import * as phoenix from '@lenovo/tan-client-bridge';
import { Emitable } from '@lenovo/tan-client-bridge/type/base';

import { SecurityAdvisorNotifications } from 'src/app/enums/security-advisor-notifications.enum';
import { CommonService } from '../common/common.service';

export class WifisecurityProxy {

	private wifisecurity: phoenix.WifiSecurity;
	private commonService: CommonService;

	private originEnableWifiSecurityFunc;
	private originGetWifiSecurityStateOnce;

	constructor(originWifiSecurity: any, commonService: CommonService)
	{
		 this.wifisecurity = originWifiSecurity;
		 this.commonService = commonService;
		 this.originEnableWifiSecurityFunc = this.wifisecurity.enableWifiSecurity.bind(this.wifisecurity);
		 this.originGetWifiSecurityStateOnce = this.wifisecurity.getWifiSecurityStateOnce.bind(this.wifisecurity);
		 this.wifisecurity.enableWifiSecurity = this.enableWifiSecurity.bind(this);
		 this.wifisecurity.getWifiSecurityStateOnce = this.getWifiSecurityStateOnce.bind(this);
	}
	enableWifiSecurity(): Promise<boolean> {
		return this.originEnableWifiSecurityFunc().then(ret => {
			if (ret)
			{
				this.commonService.sendNotification(SecurityAdvisorNotifications.WifiSecurityTurnedOn);
			}
			return ret;
		});
	}

	getObj(): phoenix.WifiSecurity{
		return this.wifisecurity;
	}

	getWifiSecurityStateOnce(): Promise<any> {
		return this.originGetWifiSecurityStateOnce().then(re =>
		{
			 this.wifisecurity.on(phoenix.EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHandler.bind(this));
			 return re;
		});
	}

	wsIsLocationServiceOnEventHandler(value) {
		if (this.wifisecurity.state === 'enabled' && value)
		{
			this.commonService.sendNotification(SecurityAdvisorNotifications.WifiSecurityTurnedOn);         }
	}
}
