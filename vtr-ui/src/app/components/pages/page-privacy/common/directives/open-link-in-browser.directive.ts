import { Directive, ElementRef, HostListener } from '@angular/core';
import { VantageCommunicationService } from '../services/vantage-communication.service';

@Directive({
	selector: '[vtrOpenLinkInBrowser]'
})
export class OpenLinkInBrowserDirective {

	constructor(
		private el: ElementRef,
		private vantageCommunicationService: VantageCommunicationService,
		) {
	}

	@HostListener('click', ['$event']) onClick($event) {
		$event.preventDefault();
		this.vantageCommunicationService.openUri(this.el.nativeElement.href);
	}

}
