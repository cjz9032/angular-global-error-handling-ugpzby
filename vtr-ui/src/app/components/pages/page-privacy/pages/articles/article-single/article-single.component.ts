import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArticlesService } from '../articles.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
	selector: 'vtr-article-single',
	templateUrl: './article-single.component.html',
	styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit, AfterViewInit {
	@ViewChild('innerHTML') articleInner: ElementRef;

	article$ = this.route.params.pipe(
		switchMap((params) => this.articlesService.getArticle(params.id)),
	);

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private route: ActivatedRoute,
		private articlesService: ArticlesService
	) {
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
