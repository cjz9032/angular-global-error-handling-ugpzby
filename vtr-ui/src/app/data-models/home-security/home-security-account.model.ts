import { CHSAccountState, CHSAccountRole } from '@lenovo/tan-client-bridge';
import { HomeSecurityCommon } from './home-security-common.model';

export class HomeSecurityAccount {
	state: CHSAccountState;
	role: CHSAccountRole;
	expirationDay: number;
	lenovoId: string;

	constructor(chs?: any, common?: HomeSecurityCommon) {
		if (chs && chs.account) {
			if (chs.account.state) {
				this.state = chs.account.state;
			}
			if (chs.account.role) {
				this.role = chs.account.role;
			}
			if (chs.account.expiration && chs.account.serverTimeUTC) {
				this.expirationDay =
					(chs.account.expiration.getTime() - chs.account.serverTimeUTC.getTime()) /
					86400000;
				if (this.expirationDay < 0) {
					this.expirationDay = 0;
				}
			}
			if (chs.account.lenovoId) {
				this.lenovoId = chs.account.lenovoId;
			}
		}
	}
}
