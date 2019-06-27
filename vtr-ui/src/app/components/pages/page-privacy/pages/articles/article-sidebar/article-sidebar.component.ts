import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, map, takeUntil } from 'rxjs/operators';
import { SecureMath } from '@lenovo/tan-client-bridge';

import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { Article, ArticlesService } from '../articles.service';
import { zip } from 'rxjs';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';

@Component({
	selector: 'vtr-article-sidebar',
	templateUrl: './article-sidebar.component.html',
	styleUrls: ['./article-sidebar.component.scss']
})
export class ArticleSidebarComponent implements OnInit, OnDestroy {
	showedArticle: Article | null;
	articlePopupId = 'articlePopupId';

	constructor(
		private articlesService: ArticlesService,
		private routerChangeHandler: RouterChangeHandlerService,
		private commonPopupService: CommonPopupService
	) {
	}

	ngOnInit() {
		zip(
			this.routerChangeHandler.onChange$.pipe(
				filter((currentPath) => this.articlesService.pagesSettings[currentPath]),
				map((currentPath) => this.articlesService.pagesSettings[currentPath]),
			),
			this.articlesService.getListOfArticles()
		).pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe(([currentPageSettings, articles]) => {
				if (currentPageSettings.visible) {
					const randomIndex = Math.floor(SecureMath.random() * articles.length);
					this.showedArticle = articles[randomIndex];
				} else {
					this.showedArticle = null;
				}
			}
		);
	}

	ngOnDestroy() {
	}

	openArticle(articleId) {
		this.commonPopupService.open(this.articlePopupId);
		console.log(articleId);
	}
}
