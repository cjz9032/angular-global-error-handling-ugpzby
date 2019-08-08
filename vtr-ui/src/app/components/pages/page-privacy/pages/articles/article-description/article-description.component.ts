import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import { map } from 'rxjs/operators';
import { FigleafOverviewService } from '../../../common/services/figleaf-overview.service';
import { DifferenceInDays } from '../../../utils/helpers';
import { AppStatusesService } from '../../../common/services/app-statuses/app-statuses.service';

@Component({
	selector: 'vtr-article-description',
	templateUrl: './article-description.component.html',
	styleUrls: ['./article-description.component.scss']
})
export class ArticleDescriptionComponent implements AfterViewInit {
	@Input() article;
	@ViewChild('innerHTML', { static: false }) articleInner: ElementRef;

	isFigleafTrialSoonExpired$ = this.appStatusesService.isFigleafSoonExpired$;
	isFigleafTrialExpired$ = this.appStatusesService.isFigleafExpired$;
	isFigleafInstalled$ = this.appStatusesService.isFigleafInstalled$;

	timeToExpires$ = this.figleafOverviewService.figleafStatus$.pipe(
		map((res) => DifferenceInDays((Date.now()), res.expirationDate * 1000))
	);

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private appStatusesService: AppStatusesService,
		private figleafOverviewService: FigleafOverviewService
	) {}

	ngAfterViewInit() {
		const thisElement = this.articleInner.nativeElement;
		thisElement.addEventListener('click', (event) => {
			this.searchLink(event.target);
			event.preventDefault();
		});
	}

	searchLink(e) {
		if (e.tagName.toLowerCase() === 'html') {
			return;
		}


		if (e.tagName.toLowerCase() === 'a') {
			this.vantageCommunicationService.openUri(e.href);
			return;
		}

		this.searchLink(e.parentElement);
	}
}
