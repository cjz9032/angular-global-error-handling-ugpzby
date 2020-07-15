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
		this.tips = document.location.href.indexOf('stage') >= 0 ? 'stageTips'
			: document.location.href.indexOf('beta') >= 0 ? 'betaTips'
			: document.location.href.indexOf('dev') >= 0
			? (document.location.href.indexOf('2') >= 0 ? 'dev2Tips' : 'devTips')
			: document.location.href.indexOf('qa') >= 0
			? (document.location.href.indexOf('2') >= 0 ? 'qa2Tips' : 'qaTips') : 'nonProduction'

		this.translate.stream(this.tips).subscribe((res: any) => {
			if (res) {
				this.nonProductionTips = res;
			}
		});
	}


	onCloseClick(event) {
		this.close.emit();
	}

}
