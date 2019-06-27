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
			if (event.target.tagName.toLowerCase() === 'a') {
				this.vantageCommunicationService.openUri(event.target.href);
			}
			event.preventDefault();
		});
	}
}
