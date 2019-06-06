import { Directive, ElementRef, Input, AfterViewInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
	selector: '[vtrCutMultilineTextWithDots]'
})
export class CutMultilineTextWithDotsDirective implements AfterViewInit {
	@Input() textToAppend: string;
	@Input() allowedLinesAmount?: number;
	@Input() addShowMoreBtn?: boolean;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private el: ElementRef,
	) {
	}

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.addCutText();
	}

	ngAfterViewInit() {
		this.addCutText();
	}

	addCutText() {
		const textToAdd = this.textToAppend.split(' ');
		const cutHtmlElement = this.el.nativeElement;
		const appendedTextTag = document.createElement('span');
		cutHtmlElement.append(appendedTextTag);
		cutHtmlElement.firstElementChild.innerText = '';

		if (this.addShowMoreBtn && !document.getElementById('show-more-btn')) {
			const newLink = document.createElement('BUTTON');
			newLink.innerHTML = 'Show more';
			newLink.setAttribute('id', 'show-more-btn');
			cutHtmlElement.appendChild(newLink);
			newLink.addEventListener('click', () => {
				cutHtmlElement.firstElementChild.innerText = this.textToAppend;
				cutHtmlElement.removeChild(newLink);
			});
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
			cutHtmlElement.firstElementChild.innerText = cutHtmlElement.firstElementChild.innerText.replace(` ${textToAdd[lastAddedWordIndex]}`, '...');
			currHeight = cutHtmlElement.offsetHeight;
		} else {
			const appendedShowMoreBtn = document.getElementById('show-more-btn');
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

}
