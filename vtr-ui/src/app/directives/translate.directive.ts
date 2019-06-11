import { Directive, Input, ElementRef, Renderer2, ViewContainerRef, TemplateRef } from '@angular/core';

import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

@Directive({
	selector: '[vtrTranslate]'
})
export class TranslateDirective {
	private isOnline:boolean=this.commonService.isOnline;
	constructor(
		private containerRef: ViewContainerRef,
		private template: TemplateRef<any>,
		private commonService: CommonService,
	) { }

	@Input() set vtrTranslate(translatedString: string) {
		const textList: Array<string> = translatedString.split(/<\/?tag>/);
		const contentTextList: Array<string> = translatedString.split(/<tag>.*?<\/tag>/);
		const tagTextList = textList.filter(text => !contentTextList.includes(text));

		this.containerRef.createEmbeddedView(this.template);
		const element: HTMLElement = this.template.elementRef.nativeElement.nextElementSibling;
		const childNodes = Array.from(element.getElementsByTagName('a'));

			childNodes.forEach((childNode, index) => {
				const childElement: HTMLElement = (<HTMLElement>childNode);
				childElement.insertAdjacentElement('afterend',document.createElement('span'))
				if (index < contentTextList.length){
					childElement.insertAdjacentText('beforebegin', contentTextList[index]);
				}
				this.commonService.notification.subscribe((notification: AppNotification) => {
					this.onNotification(notification);
					if(this.isOnline){
						if (index < tagTextList.length) {
							childElement.innerText = tagTextList[index];
							childElement.nextElementSibling.innerHTML=""
						}
					}else{
						if(index<tagTextList.length){
							childElement.innerText=""
							childElement.nextElementSibling.innerHTML=tagTextList[index];
						}
					}

				})
				if (index === childNodes.length - 1 && index + 1 < contentTextList.length) {
					element.insertAdjacentText('beforeend', contentTextList[index + 1]);
				}
			});
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}
}
