import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { Article, ArticlesService } from '../articles.service';

@Component({
	selector: 'vtr-article-sidebar',
	templateUrl: './article-sidebar.component.html',
	styleUrls: ['./article-sidebar.component.scss']
})
export class ArticleSidebarComponent implements OnInit, OnDestroy {
	showedArticle: Article;

	constructor(
		private articlesService: ArticlesService,
		private routerChangeHandler: RouterChangeHandlerService
	) {
	}

	ngOnInit() {
		this.routerChangeHandler.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((currentPath) => this.articlesService.pagesSettings[currentPath] && this.articlesService.pagesSettings[currentPath].visible)
			)
			.subscribe(
				(currentPath) => {
					const articlesForCurrentPath = this.articlesService.pagesSettings[currentPath].articles;
					const randomIndex = Math.floor(Math.random() * articlesForCurrentPath.length);
					this.showedArticle = articlesForCurrentPath[randomIndex];
				}
			);
	}

	ngOnDestroy() {
	}
}
