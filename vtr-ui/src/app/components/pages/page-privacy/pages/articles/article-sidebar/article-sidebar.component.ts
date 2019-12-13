import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { SecureMath } from '@lenovo/tan-client-bridge';

import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../../core/services/router-change-handler.service';
import { Article, ArticlesService } from '../articles.service';
import { combineLatest, merge, timer } from 'rxjs';
import { CommonPopupService } from '../../../core/services/popups/common-popup.service';
import { CommonService } from '../../../../../../services/common/common.service';
import { NetworkStatus } from '../../../../../../enums/network-status.enum';

@Component({
	selector: 'vtr-article-sidebar',
	templateUrl: './article-sidebar.component.html',
	styleUrls: ['./article-sidebar.component.scss']
})
export class ArticleSidebarComponent implements OnInit, OnDestroy {
	showedArticle: Article | null;
	articlePopupId = 'articlePopupId';
	isOnline = this.commonService.isOnline;
	article;

	constructor(
		private articlesService: ArticlesService,
		private routerChangeHandler: RouterChangeHandlerService,
		private commonPopupService: CommonPopupService,
		private commonService: CommonService
	) {	}

	ngOnInit() {
		this.checkOnline();

		this.setArticlePreview();

		this.commonPopupService.getOpenState(this.articlePopupId)
			.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((state) => !state.isOpenState)
			)
			.subscribe(() => {
				this.article = null;
			});
	}

	ngOnDestroy() {
	}

	openArticle(articleId) {
		if (!this.commonService.isOnline) {
			return;
		}

		this.articlesService.getArticle(articleId).subscribe((article) => {
			this.article = article;
		});

		this.commonPopupService.open(this.articlePopupId);
	}

	private checkOnline() {
		this.commonService.notification.pipe(
			filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline),
			map((notification) => notification.payload),
			takeUntil(instanceDestroyed(this))
		).subscribe((payload) => {
			this.isOnline = payload.isOnline;
		});
	}

	private setArticlePreview() {
		merge(
			timer(0),
			this.commonService.notification,
		).pipe(
			filter((notification) => !this.showedArticle && (typeof notification === 'number' ? this.isOnline : notification.type === NetworkStatus.Online)),
			switchMap(() => combineLatest(
				[
					this.routerChangeHandler.onChange$.pipe(
						filter((currentPath) => this.articlesService.pagesSettings[currentPath]),
						map((currentPath) => this.articlesService.pagesSettings[currentPath]),
					),
					this.articlesService.getListOfArticles()
				]
			)),
			takeUntil(instanceDestroyed(this)),
		).subscribe(([currentPageSettings, articles]) => {
			if (currentPageSettings.visible) {
				const randomIndex = Math.floor(SecureMath.random() * articles.length);
				this.showedArticle = articles[randomIndex];
			} else {
				this.showedArticle = null;
			}
		});
	}
}
