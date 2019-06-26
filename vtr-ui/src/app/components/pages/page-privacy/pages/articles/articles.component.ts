import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticlesService } from './articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutersName } from '../../privacy-routing-name';

@Component({
	selector: 'vtr-articles',
	templateUrl: './articles.component.html',
	styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {

	articles = this.articlesService.articles;
	articles$ = this.articlesService.getListOfArticles();
	openArticleId = null;
	recommendationsArticles = null;

	constructor(
		private activatedRoute: ActivatedRoute,
		private articlesService: ArticlesService,
		private router: Router
	) {
	}

	ngOnInit() {

		const getFilteredArticlesByCategory = (category) => {
			return this.articlesService.filterArticlesByCategory(category).filter((article) => article.id !== this.openArticleId);
		};
		this.activatedRoute.queryParams.subscribe((val) => {
			this.openArticleId = val.id || null;
			const openArticle = this.articles[this.openArticleId];
			this.recommendationsArticles = openArticle ? getFilteredArticlesByCategory(openArticle.category) : null;
		});
	}

	ngOnDestroy() {
	}

	openArticle(id: string) {
		this.router.navigateByUrl(`/${RoutersName.PRIVACY}/${RoutersName.ARTICLEDETAILS}/${id}`);
	}
}
