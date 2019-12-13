import {
	AfterViewInit,
	Directive,
	ElementRef,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges
} from '@angular/core';

@Directive({
	selector: '[vtrCutMultilineTextWithDots]'
})
export class CutMultilineTextWithDotsDirective implements AfterViewInit, OnDestroy, OnChanges {
	@Input() textToAppend: string;
	@Input() allowedLinesAmount?: number;
	@Input() addShowMoreBtn?: boolean;
	showMoreBtnClickHandler = this.showMoreBtnClick.bind(this);

	constructor(
		// @Inject(DOCUMENT) private document: Document,
		private el: ElementRef,
	) {
	}

	@HostListener('window:resize', ['$event'])
	onResize($event) {
		this.addCutText();
	}

	ngAfterViewInit() {
		this.addCutText();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.textToAppend) {
			this.addCutText();
		}
	}

	addCutText() {
		const textToAdd = this.textToAppend.split(' ');
		const cutHtmlElement = this.el.nativeElement;
		const appendedTextTag = window.document.createElement('span');
		cutHtmlElement.append(appendedTextTag);
		cutHtmlElement.firstElementChild.innerText = '';

		if (this.addShowMoreBtn && !cutHtmlElement.getElementsByClassName('js-show-more-btn')[0]) {
			this.appendShowMoreButtonToElement();
		}

		let allowedHeight = 0;
		let currHeight = 0;
		let lastAddedWordIndex = 0;
		const allowedLines = this.allowedLinesAmount || 2;
		textToAdd.forEach((word, index) => {
			if (currHeight <= allowedHeight) {
				cutHtmlElement.firstElementChild.innerText += `${word} `;
				currHeight = cutHtmlElement.offsetHeight;
				if (index === 0) {
					allowedHeight = currHeight * allowedLines + (allowedLines / 2); // (allowedLines / 2) - for case if browser will round height
				}
				lastAddedWordIndex = index;
			}
		});
		const hasMoreWords = lastAddedWordIndex <= textToAdd.length - 1;
		if (hasMoreWords && currHeight > allowedHeight) {
			const str = cutHtmlElement.firstElementChild.innerText;
			const wordToRemove = ` ${textToAdd[lastAddedWordIndex]}`;
			const n = str.lastIndexOf(wordToRemove);
			cutHtmlElement.firstElementChild.innerText = str.slice(0, n) + str.slice(n).replace(wordToRemove, '...');
			currHeight = cutHtmlElement.offsetHeight;
		} else {
			const appendedShowMoreBtn = document.getElementsByClassName('js-show-more-btn')[0];
			if (appendedShowMoreBtn) {
				cutHtmlElement.removeChild(appendedShowMoreBtn);
			}
		}

		for (let i = 1; i < textToAdd.length; i++) { // if last word moved to next line after adding '...' or 'Show more btn'
			if (cutHtmlElement.offsetHeight > allowedHeight) {
				cutHtmlElement.firstElementChild.innerText = cutHtmlElement.firstElementChild.innerText.replace(` ${textToAdd[lastAddedWordIndex - i]}...`, '...');
			} else {
				return;
			}
		}
	}

	private showMoreBtnClick() {
		const appendedShowMoreBtn = document.getElementsByClassName('js-show-more-btn')[0];
		const cutHtmlElement = this.el.nativeElement;
		cutHtmlElement.removeChild(appendedShowMoreBtn);
		cutHtmlElement.firstElementChild.innerText = this.textToAppend;
	}

	appendShowMoreButtonToElement() {
		const cutHtmlElement = this.el.nativeElement;
		const showMoreBtn = document.createElement('BUTTON');
		showMoreBtn.innerHTML = 'View more';
		showMoreBtn.setAttribute('class', 'js-show-more-btn');
		cutHtmlElement.appendChild(showMoreBtn);
		showMoreBtn.addEventListener('click', this.showMoreBtnClickHandler);
	}

	ngOnDestroy() {
		const appendedShowMoreBtn = document.getElementsByClassName('js-show-more-btn')[0];
		if (appendedShowMoreBtn) {
			appendedShowMoreBtn.removeEventListener('click', this.showMoreBtnClickHandler);
		}
	}

}
