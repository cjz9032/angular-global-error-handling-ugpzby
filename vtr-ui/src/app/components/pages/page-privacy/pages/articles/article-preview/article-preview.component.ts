import {
	Component,
	ElementRef,
	Input,
	OnInit,
	AfterViewInit,
	ViewChild,
} from '@angular/core';
import { Article } from '../articles.service';
import { Router } from '@angular/router';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { RoutersName } from '../../../privacy-routing-name';

@Component({
	selector: 'vtr-article-preview',
	templateUrl: './article-preview.component.html',
	styleUrls: ['./article-preview.component.scss']
})
export class ArticlePreviewComponent implements OnInit, AfterViewInit {
	@Input() article: Article;
	@ViewChild('articleTitle') articleTitle: ElementRef;

	articlePopupId = 'articlePopupId';

	constructor(
		private router: Router,
		private routerChangeHandlerService: RouterChangeHandlerService,
		private commonPopupService: CommonPopupService,
	) {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		const textToAdd = this.article.title.split(' ');
		const cutHtmlElement = this.articleTitle.nativeElement;

		let lineHeight = 0;
		let currHeight = 0;
		let lastAddedWordIndex = 0;
		const allowedLines = 2;
		textToAdd.forEach((word, index) => {
			if (currHeight <= lineHeight * allowedLines) {
				cutHtmlElement.innerHTML += `${word} `;
				currHeight = cutHtmlElement.offsetHeight;
				if (index === 0) {
					lineHeight = currHeight;
				}
				lastAddedWordIndex = index;
			}
		});
		const hasMoreWords = lastAddedWordIndex <= textToAdd.length - 1;
		const higherThenAllowed = currHeight > lineHeight * allowedLines;
		if (hasMoreWords && higherThenAllowed) {
			cutHtmlElement.innerHTML = cutHtmlElement.innerHTML.replace(` ${textToAdd[lastAddedWordIndex]}`, '...');
		}
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
