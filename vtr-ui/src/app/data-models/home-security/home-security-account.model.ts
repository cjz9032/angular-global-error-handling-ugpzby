import { CHSAccountState, CHSAccount } from '@lenovo/tan-client-bridge';

export class HomeSecurityAccount {

	state: CHSAccountState;
	expiration: Date;
	standardTime: Date;
	lenovoIdLoggedIn: boolean;

	constructor(chsAccount: CHSAccount) {
		this.state = chsAccount.state;
		this.expiration = chsAccount.expiration;
		this.standardTime = chsAccount.serverTimeUTC;
		this.lenovoIdLoggedIn = chsAccount.lenovoId.loggedIn;
	}
}
