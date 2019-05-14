import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticlesService } from './articles.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'vtr-articles',
	templateUrl: './articles.component.html',
	styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {

	articles = this.articlesService.articles;
	openArticleId = null;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private articlesService: ArticlesService,
	) {
	}

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe((val) => {
			this.openArticleId = val.id || null;
		});
	}

	ngOnDestroy() {
	}

	openSingleArticle(id) {
		this.router.navigate(['privacy', 'articles'], {queryParams: {id: id}});
	}
}
