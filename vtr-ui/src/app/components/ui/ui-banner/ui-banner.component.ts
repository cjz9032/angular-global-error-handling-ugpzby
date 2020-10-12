import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vtr-ui-banner',
  templateUrl: './ui-banner.component.html',
  styleUrls: ['./ui-banner.component.scss']
})
export class UiBannerComponent implements OnInit  {
	public nonProductionTips: string
	private tips: string

	// tslint:disable-next-line:no-output-native
	@Output() close: EventEmitter<any> = new EventEmitter();
	constructor(
		private translate: TranslateService,
	) {}

	ngOnInit() {
		this.tips = document.location.href.indexOf('stage') >= 0 ? 'stage'
			: document.location.href.indexOf('beta') >= 0 ? 'beta'
			: document.location.href.indexOf('dev') >= 0
			? (document.location.href.indexOf('2') >= 0 ? 'DEV2' : 'DEV')
			: document.location.href.indexOf('qa') >= 0
			? (document.location.href.indexOf('2') >= 0 ? 'QA2' : 'QA') : 'non-production';

		const buildPath = document.location.pathname;
		if (buildPath.length > 1) {
			this.tips += `-${buildPath}`;
		}
		this.nonProductionTips = `You're now visiting the ${this.tips} version of Lenovo Vantage!`;
	}


	onCloseClick(event) {
		this.close.emit();
	}

}
