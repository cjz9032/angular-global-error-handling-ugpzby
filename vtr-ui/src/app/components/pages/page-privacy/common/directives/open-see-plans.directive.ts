import { Directive, HostListener } from '@angular/core';
import { VantageCommunicationService } from '../services/vantage-communication.service';
import { map, switchMap, take } from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Directive({
	selector: '[vtrOpenSeePlans]'
})
export class OpenSeePlansDirective {

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private logger: LoggerService,
		private communicationWithFigleafService: CommunicationWithFigleafService
	) { }

	@HostListener('click', ['$event']) onClick($event) {
		this.communicationWithFigleafService.sendMessageToFigleaf({ type: 'getFigleafLinks' }).pipe(
			map((response) => response['payload']),
			switchMap((response) => this.vantageCommunicationService.openUri(response.seePlansLink)),
			take(1)
		).subscribe(
			() => { },
			(error) => this.logger.error('Open link error ', error.message));
	}
}
