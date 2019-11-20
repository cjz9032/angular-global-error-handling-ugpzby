import { Injectable } from '@angular/core';
import { ClearData } from '../../../core/components/clear-data-tooltip/clear-data';
import { UserAllowService } from '../../../core/services/user-allow.service';

@Injectable({
	providedIn: 'root'
})
export class ClearTrackersService implements ClearData {

	constructor(private userAllowService: UserAllowService) {
	}

	clearData() {
		this.userAllowService.setShowTrackingMap(false);
	}

	getText(): { text: string; content: string } {
		return {
			text: 'Clear my tracking tools results',
			content: 'Are you sure you want to clear the information about found tracking tools?'
		};
	}
}
