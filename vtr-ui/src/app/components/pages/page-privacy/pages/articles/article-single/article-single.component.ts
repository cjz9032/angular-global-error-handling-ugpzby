import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '../articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { RoutersName } from '../../../privacy-routing-name';
import { SecureMath } from '@lenovo/tan-client-bridge';
import { combineLatest } from 'rxjs';
import { CommonService } from '../../../../../../services/common/common.service';

@Component({
	selector: 'vtr-article-single',
	templateUrl: './article-single.component.html',
	styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit {
	article$ = this.route.queryParams.pipe(
		switchMap((params) => this.articlesService.getArticle(params.articleId)),
	);
	otherArticles$ = combineLatest([
		this.articlesService.getListOfArticles(),
		this.route.queryParams
	]).pipe(
		map(([articles, params]) => articles.filter((article) => article.ActionLink !== params.articleId)),
		map((articles) => {
			const randomIndex = Math.floor(SecureMath.random() * (articles.length - 2));
			return articles.slice(randomIndex, randomIndex + 2);
		})
	);

	constructor(
		private route: ActivatedRoute,
		private articlesService: ArticlesService,
		private router: Router,
		private commonService: CommonService
	) {
	}

	ngOnInit() {
	}

	openArticle(articleId) {
		if (!this.commonService.isOnline) {
			return;
		}
		this.router.navigate([`/${RoutersName.PRIVACY}/${RoutersName.ARTICLEDETAILS}`], {queryParams: {articleId}});
		this.commonService.scrollTop();
	}

}
