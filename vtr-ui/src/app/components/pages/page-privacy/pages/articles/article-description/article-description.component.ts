import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import { AppStatuses } from '../../../userDataStatuses';
import { map } from 'rxjs/operators';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { FigleafOverviewService } from '../../../common/services/figleaf-overview.service';

@Component({
	selector: 'vtr-article-description',
	templateUrl: './article-description.component.html',
	styleUrls: ['./article-description.component.scss']
})
export class ArticleDescriptionComponent implements AfterViewInit {
	@Input() article;
	@ViewChild('innerHTML', { static: false }) articleInner: ElementRef;

	isFigleafTrialSoonExpired$ = this.userDataGetStateService.isFigleafTrialSoonExpired$;
	isFigleafTrialExpired$ = this.userDataGetStateService.isFigleafTrialExpired$;
	isFigleafInstalled$ = this.userDataGetStateService.isFigleafInstalled$;

	timeToExpires$ = this.figleafOverviewService.figleafStatus$.pipe(
		map((res) => res.daysToNotifyTrialExpired)
	);

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private userDataGetStateService: UserDataGetStateService,
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
