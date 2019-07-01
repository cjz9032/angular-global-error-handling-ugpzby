import { Directive, HostListener } from '@angular/core';
import { VantageCommunicationService } from '../services/vantage-communication.service';
import { TrialExpiredWidgetService } from '../../main-layout/sidebar/trial-expired-widget/trial-expired-widget.service';
import { map, switchMap } from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Directive({
	selector: '[vtrOpenSeePlans]'
})
export class OpenSeePlansDirective {

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private communicationWithFigleafService: CommunicationWithFigleafService
	) {}

	@HostListener('click', ['$event']) onClick() {
		this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafLinks'}).pipe(
			map((response) => response['payload']),
			switchMap((response) => this.vantageCommunicationService.openUri(response.seePlansLink))
		).subscribe(
			() => {},
			(err) => console.error('Open link error ', err));
	}

}
