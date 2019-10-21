import { Injectable } from '@angular/core';
import { ClearData } from './clear-data';
import { UserAllowService } from '../../../services/user-allow.service';

@Injectable({
	providedIn: 'root'
})
export class ClearPasswordService implements ClearData {

	constructor(private userAllowService: UserAllowService) {
	}

	clearData() {
		this.userAllowService.setConsentForVulnerablePassword(false);
	}
}
