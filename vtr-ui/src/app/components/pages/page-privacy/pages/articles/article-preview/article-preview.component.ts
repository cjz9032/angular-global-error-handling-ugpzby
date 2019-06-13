import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../articles.service';
import { Router } from '@angular/router';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { RoutersName } from '../../../privacy-routing-name';

@Component({
	selector: 'vtr-article-preview',
	templateUrl: './article-preview.component.html',
	styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent implements OnInit {
	@Input() article: Article;

	articlePopupId = 'articlePopupId';

	constructor(
		private router: Router,
		private routerChangeHandlerService: RouterChangeHandlerService,
		private commonPopupService: CommonPopupService,
	) {
	}

	ngOnInit() {
	}

	openSingleArticle(id) {
		if (this.routerChangeHandlerService.currentRoute === RoutersName.ARTICLES) {
			this.router.navigate([RoutersName.PRIVACY, RoutersName.ARTICLES], {queryParams: {id: id}});
		} else {
			this.commonPopupService.open(this.articlePopupId);
		}
	}

	closeArticlePopup() {
		this.commonPopupService.close(this.articlePopupId);
	}
}
