import { Injectable } from '@angular/core';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';


@Injectable({
	providedIn: 'root',
})
export class HomeSecurityMockService {
	public account: HomeSecurityAccount = {
		id: '0',
		name : 'all',
		subscription: 'localAccount',
	};

	public id = 0;
}
