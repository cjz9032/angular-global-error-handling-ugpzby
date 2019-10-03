import { Component } from '@angular/core';
import { ArticlesService } from './articles.service';
import { Router } from '@angular/router';
import { RoutersName } from '../../privacy-routing-name';
import { CommonService } from '../../../../../services/common/common.service';

@Component({
	selector: 'vtr-articles',
	templateUrl: './articles.component.html',
	styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {
	articles$ = this.articlesService.getListOfArticles();

	constructor(
		private articlesService: ArticlesService,
		private router: Router,
		private commonService: CommonService
	) {
	}

	openArticle(articleId: string) {
		if (!this.commonService.isOnline) {
			return;
		}
		this.router.navigate([`/${RoutersName.PRIVACY}/${RoutersName.ARTICLEDETAILS}`], {queryParams: {articleId}});
	}
}
