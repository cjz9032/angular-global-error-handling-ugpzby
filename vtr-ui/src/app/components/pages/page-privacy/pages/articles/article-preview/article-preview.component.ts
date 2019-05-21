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
		const myText = this.article.title.split(' ');
		const el = this.articleTitle.nativeElement;


		let lineHeight = 0;
		let currHeight = 0;
		let lastAddedWordIndex = 0;
		myText.forEach((word, index) => {
			if (currHeight <= lineHeight * 2) {
				el.innerHTML += `${word} `;
				currHeight = el.offsetHeight;
				if (index === 0) {
					lineHeight = currHeight;
				}
				lastAddedWordIndex = index;
			}
		});
		const hasMoreWords = lastAddedWordIndex <= myText.length - 1;
		const higherThenTwoLines = currHeight > lineHeight * 2;
		if (hasMoreWords && higherThenTwoLines) {
			el.innerHTML = el.innerHTML.replace(` ${myText[lastAddedWordIndex]}`, '...');
		}

		// const n = 2;
		// let lastHeight, hJumps = 0;
		// myText.forEach((w, idx) => {
		// 	const h = el.offsetHeight;
		// 	console.log(h, lastHeight)
		// 	if (h !== lastHeight && idx !== 0) {
		// 		hJumps++;
		// 	}
		// 	if (hJumps < n) {
		// 		el.innerHTML += `${w} `;
		// 		lastHeight = h;
		// 	} else {
		// 		console.log('elWidth', el.offsetWidth);
		// 		console.log('parentWidth', parentWidth);
		// 	}
		// });


		// const hiddenEl = document.createElement('h2');
		// hiddenEl.style.fontSize = '2rem';
		// // const hiddenEl = el.cloneNode(false);
		// console.log(hiddenEl.style);
		// hiddenEl.innerHTML = el.innerHtml;
		// // console.log('hiddenEl', hiddenEl);
		// console.log('hiddenEl.offsetHeight', hiddenEl.offsetHeight);
		// console.log('el.offsetHeight', el.offsetHeight);
		//
		// myText.forEach(word => {
		// 	this.cuttedArticleTitle += `${word} `;
		// 	// console.log('++++++++++++ el', el.offsetHeight);
		// });
		//
		// let widthOfNewString = 0;
		// const str = this.articleTitle.nativeElement.innerHTML.split(' ');
		// const elementWidth = this.articleTitle.nativeElement.offsetWidth;
		// const lineHeight = document.defaultView.getComputedStyle(el, null).getPropertyValue('lineHeight');
		// // console.log('lineHeight', lineHeight);
		// // const elementHeight = this.articleTitle.nativeElement.offsetHeight;
		// // hiddenEl.classList.add('article-preview__title');
		// // document.body.appendChild(hiddenEl);
		// // var newStr = '';
		// // str.forEach((letter) => {
		// // 	// hiddenEl.innerText = letter + ' ';
		// // 	widthOfNewString = hiddenEl.offsetWidth;
		// // 	if (widthOfNewString < (elementWidth * 2)) {
		// // 		hiddenEl.innerText += letter + ' ';
		// // 		newStr += letter + ' ';
		// // 	}
		// // });
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
