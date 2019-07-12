import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Article } from '../articles.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';

@Component({
	selector: 'vtr-article-single',
	templateUrl: './article-single.component.html',
	styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit, AfterViewInit {
	@ViewChild('innerHTML', { static: true }) articleInner: ElementRef;
	@Input() articleData: Article;

	constructor(private vantageCommunicationService: VantageCommunicationService) {
	}

	ngOnInit() {
	}

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
