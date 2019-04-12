import { Directive, Input, ElementRef, Renderer2, ViewContainerRef, TemplateRef } from '@angular/core';

@Directive({
	selector: '[vtrTranslate]'
})
export class TranslateDirective {

	constructor(
		private containerRef: ViewContainerRef,
		private template: TemplateRef<any>,
	) { }

	@Input() set vtrTranslate(translatedString: string) {
		const textList: Array<string> = translatedString.split(/<\/?tag>/);
		const contentTextList: Array<string> = translatedString.split(/<tag>.*?<\/tag>/);
		const tagTextList = textList.filter(text => !contentTextList.includes(text));

		this.containerRef.createEmbeddedView(this.template);
		const element: HTMLElement = this.template.elementRef.nativeElement.nextElementSibling;
		const childNodes = Array.from(element.childNodes);
		childNodes.forEach((childNode, index) => {
			const childElement: HTMLElement = (<HTMLElement>childNode);
			if (index < contentTextList.length){
				childElement.insertAdjacentText('beforebegin', contentTextList[index]);
			}
			if (index < tagTextList.length) {
				childElement.innerText = tagTextList[index];
			}
			if (index === childNodes.length - 1 && index + 1 < contentTextList.length) {
				childElement.insertAdjacentText('afterend', contentTextList[index + 1]);
			}
		});
	}
}