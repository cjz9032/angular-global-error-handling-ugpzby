import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-chose-browser',
	templateUrl: './chose-browser.component.html',
	styleUrls: ['./chose-browser.component.scss']
})
export class ChoseBrowserComponent {
	@Output() rejection = new EventEmitter<void>();
	@Output() browser = new EventEmitter<string>();

	browserList = [
		{
			name: 'Chrome',
			img: '/assets/images/privacy-tab/chrome.svg',
			value: 'chrome'
		},
		{
			name: 'Edge',
			img: '/assets/images/privacy-tab/edge.svg',
			value: 'edge'
		},
		{
			name: 'Firefox',
			img: '/assets/images/privacy-tab/firefox.svg',
			value: 'firefox'
		},
	];

	chosenBroswer = this.browserList[0].value;

	choseBrowser(browserValue) {
		this.chosenBroswer = browserValue;
	}

	browserEmit() {
		this.browser.emit(this.chosenBroswer);
	}
}
