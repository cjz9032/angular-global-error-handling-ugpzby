import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArticlesService } from '../articles.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { RoutersName } from '../../../privacy-routing-name';

@Component({
	selector: 'vtr-article-single',
	templateUrl: './article-single.component.html',
	styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit, AfterViewInit {
	@ViewChild('innerHTML') articleInner: ElementRef;

	article$ = this.route.queryParams.pipe(
		switchMap((params) => this.articlesService.getArticle(params.articleId)),
	);
	otherArticles$ = this.articlesService.getListOfArticles().pipe(
		withLatestFrom(this.route.queryParams),
		map(([articles, params]) => articles.filter((article) => article.id !== params.articleId)),
		map((articles) => articles.slice(0, 2))
	);

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private route: ActivatedRoute,
		private articlesService: ArticlesService,
		private router: Router
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

	openArticle(articleId) {
		this.router.navigate([`/${RoutersName.PRIVACY}/${RoutersName.ARTICLEDETAILS}`], {queryParams: {articleId}});
	}

}
