import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';

@Component({
	selector: 'vtr-article-description',
	templateUrl: './article-description.component.html',
	styleUrls: ['./article-description.component.scss']
})
export class ArticleDescriptionComponent implements AfterViewInit {
	@Input() article;
	@ViewChild('innerHTML') articleInner: ElementRef;

	constructor(
		private vantageCommunicationService: VantageCommunicationService
	) {}

	ngAfterViewInit() {
		const thisElement = this.articleInner.nativeElement;
		thisElement.addEventListener('click', (event) => {
			this.searchLink(event.target);
			event.preventDefault();
		});
	}

	searchLink(e) {
		console.log('click', e.tagName);
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
