import { Injectable } from '@angular/core';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class TrialExpiredWidgetService {

	constructor(private communicationWithFigleafService: CommunicationWithFigleafService) {
	}

	getLinkForSeePlans() {
		return this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafLinks'}).pipe(
			map((response) => response['payload'])
		);
	}
}
