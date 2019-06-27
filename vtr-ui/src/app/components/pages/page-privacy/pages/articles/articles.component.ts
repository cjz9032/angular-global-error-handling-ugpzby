import { Component } from '@angular/core';
import { ArticlesService } from './articles.service';
import { Router } from '@angular/router';
import { RoutersName } from '../../privacy-routing-name';

@Component({
	selector: 'vtr-articles',
	templateUrl: './articles.component.html',
	styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {
	articles$ = this.articlesService.getListOfArticles();

	constructor(
		private articlesService: ArticlesService,
		private router: Router
	) {
	}

	openArticle(articleId: string) {
		this.router.navigate([`/${RoutersName.PRIVACY}/${RoutersName.ARTICLEDETAILS}`], {queryParams: {articleId}});
	}
}
