import { CHSAccountState } from '@lenovo/tan-client-bridge';
import { HomeSecurityCommon } from './home-security-common.model';


export class HomeSecurityAccount {

	state: CHSAccountState;
	expiration: Date;
	standardTime: Date;
	lenovoIdLoggedIn: boolean;
	lenovoId: string;
	createAccount() {}
	purchase() {}

	constructor(chs?: any, common?: HomeSecurityCommon) {
		if (chs && chs.account) {
			this.state = chs.account.state;
			this.expiration = chs.account.expiration;
			this.standardTime = chs.account.serverTimeUTC;
			if (chs.account.lenovoId) {
				this.lenovoIdLoggedIn = chs.account.lenovoId.loggedIn;
				this.lenovoId = chs.account.lenovoId.email;
			}
			if (common) {
				this.createAccount = common.startTrial.bind(common);
				this.purchase = common.upgrade.bind(common);
			}
		}
	}
}
