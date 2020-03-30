import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vtr-ui-banner',
  templateUrl: './ui-banner.component.html',
  styleUrls: ['./ui-banner.component.scss']
})
export class UiBannerComponent {
	@Output() bannerClose: EventEmitter<any> = new EventEmitter();
	constructor() {}


	onCloseClick(event) {
		this.bannerClose.emit();
	}

}
