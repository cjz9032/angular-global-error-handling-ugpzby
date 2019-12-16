import { Injectable } from '@angular/core';
import { ClearData } from '../../../core/components/clear-data-tooltip/clear-data';
import { UserAllowService } from '../../../core/services/user-allow.service';

@Injectable({
	providedIn: 'root'
})
export class ClearPasswordService implements ClearData {

	constructor(private userAllowService: UserAllowService) {
	}

	clearData() {
		this.userAllowService.setConsentForVulnerablePassword(false);
	}

	getText(): { text: string; content: string } {
		return {
			text: 'Clear my vulnerable passwords results',
			content: 'Are you sure you want to clear the information about found vulnerable passwords?'
		};
	}
}
