import { Directive, ElementRef, Input, AfterViewInit, HostListener } from '@angular/core';

@Directive({
	selector: '[vtrCutMultilineTextWithDots]'
})
export class CutMultilineTextWithDotsDirective implements AfterViewInit {
	@Input() textToAppend: string;
	@Input() allowedLinesAmount?: number;

	constructor(
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
		cutHtmlElement.innerHTML = '';

		let allowedHeight = 0;
		let currHeight = 0;
		let lastAddedWordIndex = 0;
		const allowedLines = this.allowedLinesAmount || 2;
		textToAdd.forEach((word, index) => {
			if (currHeight <= allowedHeight) {
				cutHtmlElement.innerHTML += `${word} `;
				currHeight = cutHtmlElement.offsetHeight;
				if (index === 0) {
					allowedHeight = currHeight * allowedLines + (allowedLines / 2); // (allowedLines / 2) - for case if browser will round height
				}
				lastAddedWordIndex = index;
			}
		});
		const hasMoreWords = lastAddedWordIndex <= textToAdd.length - 1;
		if (hasMoreWords && currHeight > allowedHeight) {
			cutHtmlElement.innerHTML = cutHtmlElement.innerHTML.replace(` ${textToAdd[lastAddedWordIndex]}`, '...');
			currHeight = cutHtmlElement.offsetHeight;
		}
		if (currHeight > allowedHeight) { // if last word moved to next line after adding '...'
			cutHtmlElement.innerHTML = cutHtmlElement.innerHTML.replace(` ${textToAdd[lastAddedWordIndex - 1]}...`, '...');
		}
	}

}
