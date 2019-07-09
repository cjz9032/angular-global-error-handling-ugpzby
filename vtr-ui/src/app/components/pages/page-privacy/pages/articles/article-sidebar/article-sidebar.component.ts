import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, map, takeUntil } from 'rxjs/operators';
import { SecureMath } from '@lenovo/tan-client-bridge';

import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { Article, ArticlesService } from '../articles.service';

@Component({
	selector: 'vtr-article-sidebar',
	templateUrl: './article-sidebar.component.html',
	styleUrls: ['./article-sidebar.component.scss']
})
export class ArticleSidebarComponent implements OnInit, OnDestroy {
	showedArticle: Article | null;

	constructor(
		private articlesService: ArticlesService,
		private routerChangeHandler: RouterChangeHandlerService
	) {
	}

	ngOnInit() {
		this.routerChangeHandler.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((currentPath) => this.articlesService.pagesSettings[currentPath]),
				map((currentPath) => this.articlesService.pagesSettings[currentPath])
			)
			.subscribe((currentPageSettings) => {
					if (currentPageSettings.visible) {
						const articlesForCurrentPage = this.articlesService.getFilteredArticlesByUserStatus();
						const randomIndex = Math.floor(SecureMath.random() * articlesForCurrentPage.length);
						this.showedArticle = articlesForCurrentPage[randomIndex];
					} else {
						this.showedArticle = null;
					}
				}
			);
	}

	ngOnDestroy() {
	}
}
