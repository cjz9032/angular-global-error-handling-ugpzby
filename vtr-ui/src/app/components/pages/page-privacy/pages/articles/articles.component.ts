import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticlesService } from './articles.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'vtr-articles',
	templateUrl: './articles.component.html',
	styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {

	articles = this.articlesService.articles;
	openArticleId = null;
	recommendationsArticles = null;

	constructor(
		private activatedRoute: ActivatedRoute,
		private articlesService: ArticlesService,
	) {
	}

	ngOnInit() {
		this.articlesService.getListOfArticles().subscribe((articles) => console.log('getListOfArticles', articles));

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
}
