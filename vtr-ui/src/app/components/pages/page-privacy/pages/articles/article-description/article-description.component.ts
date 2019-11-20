import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VantageCommunicationService } from '../../../core/services/vantage-communication.service';
import { map } from 'rxjs/operators';
import { FigleafOverviewService } from '../../../core/services/figleaf-overview.service';
import { DifferenceInDays } from '../../../utils/helpers';
import { AppStatusesService } from '../../../core/services/app-statuses/app-statuses.service';
import { AppStatuses } from '../../../userDataStatuses';
import { Router } from '@angular/router';
import { RoutersName } from '../../../privacy-routing-name';

@Component({
	selector: 'vtr-article-description',
	templateUrl: './article-description.component.html',
	styleUrls: ['./article-description.component.scss']
})
export class ArticleDescriptionComponent implements AfterViewInit {
	@Input() article;
	@ViewChild('innerHTML', { static: false }) articleInner: ElementRef;

	isShow$ = this.appStatusesService.isAppStatusesEqual([
		AppStatuses.trialSoonExpired,
		AppStatuses.subscriptionSoonExpired,
		AppStatuses.trialExpired,
		AppStatuses.subscriptionExpired
	]);

	appStatuses$ = this.appStatusesService.globalStatus$.pipe(
		map((globalStatus) => globalStatus.appState)
	);

	isFigleafInstalled$ = this.appStatusesService.isAppStatusesEqual([AppStatuses.figLeafInstalled]);

	timeToExpires$ = this.figleafOverviewService.figleafStatus$.pipe(
		map((res) => DifferenceInDays((Date.now()), res.expirationDate * 1000) || 1)
	);

	isLanding = this.router.url.includes(RoutersName.LANDING);

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private appStatusesService: AppStatusesService,
		private figleafOverviewService: FigleafOverviewService,
		private router: Router
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
