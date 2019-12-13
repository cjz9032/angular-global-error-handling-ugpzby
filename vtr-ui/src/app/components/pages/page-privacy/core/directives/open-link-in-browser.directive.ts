import { Directive, ElementRef, HostListener } from '@angular/core';
import { VantageCommunicationService } from '../services/vantage-communication.service';
import { CommonService } from '../../../../../services/common/common.service';

@Directive({
	selector: '[vtrOpenLinkInBrowser]'
})
export class OpenLinkInBrowserDirective {

	constructor(
		private el: ElementRef,
		private vantageCommunicationService: VantageCommunicationService,
		private commonService: CommonService,
		) {
	}

	@HostListener('click', ['$event']) onClick($event) {
		if (!this.commonService.isOnline) {
			return;
		}

		$event.preventDefault();
		this.vantageCommunicationService.openUri(this.el.nativeElement.href);
	}

}
