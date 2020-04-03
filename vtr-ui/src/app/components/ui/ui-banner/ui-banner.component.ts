import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vtr-ui-banner',
  templateUrl: './ui-banner.component.html',
  styleUrls: ['./ui-banner.component.scss']
})
export class UiBannerComponent {
	// tslint:disable-next-line:no-output-native
	@Output() close: EventEmitter<any> = new EventEmitter();
	constructor() {}


	onCloseClick(event) {
		this.close.emit();
	}

}
