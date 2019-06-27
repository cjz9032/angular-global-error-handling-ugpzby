import { Component, Input, OnInit } from '@angular/core';
import { ArticlesService } from '../articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { RoutersName } from '../../../privacy-routing-name';

@Component({
	selector: 'vtr-article-single',
	templateUrl: './article-single.component.html',
	styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit {
	@Input() article;

	article$ = this.route.queryParams.pipe(
		switchMap((params) => this.articlesService.getArticle(params.articleId)),
	);
	otherArticles$ = this.articlesService.getListOfArticles().pipe(
		withLatestFrom(this.route.queryParams),
		map(([articles, params]) => articles.filter((article) => article.id !== params.articleId)),
		map((articles) => articles.slice(0, 2))
	);

	constructor(
		private route: ActivatedRoute,
		private articlesService: ArticlesService,
		private router: Router
	) {
	}

	ngOnInit() {
	}

	openArticle(articleId) {
		this.router.navigate([`/${RoutersName.PRIVACY}/${RoutersName.ARTICLEDETAILS}`], {queryParams: {articleId}});
	}

}
