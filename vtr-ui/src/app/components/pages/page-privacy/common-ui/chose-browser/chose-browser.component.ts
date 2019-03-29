import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'vtr-chose-browser',
	templateUrl: './chose-browser.component.html',
	styleUrls: ['./chose-browser.component.scss']
})
export class ChoseBrowserComponent implements OnChanges {
	@Input() browserList: any[] = [];
	@Output() rejection = new EventEmitter<void>();
	@Output() browser = new EventEmitter<string>();

	chosenBroswer;

	ngOnChanges(changes: SimpleChanges) {
		const {browserList} = changes;
		if (browserList.currentValue) {
			this.choseBrowser(browserList.currentValue[0].value);
		}
	}

	choseBrowser(browserValue) {
		this.chosenBroswer = browserValue;
	}

	browserEmit() {
		this.browser.emit(this.chosenBroswer);
	}
}
