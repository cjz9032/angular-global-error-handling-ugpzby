import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vtr-ui-banner',
  templateUrl: './ui-banner.component.html',
  styleUrls: ['./ui-banner.component.scss']
})
export class UiBannerComponent implements OnInit  {
	public nonProductionTips: string

	// tslint:disable-next-line:no-output-native
	@Output() close: EventEmitter<any> = new EventEmitter();
	constructor(
		private translate: TranslateService,
	) {}

	ngOnInit() {
		this.translate.stream('nonProduction').subscribe((res: any) => {
			if (res) {
				this.nonProductionTips = res;
			}
		});
	}


	onCloseClick(event) {
		this.close.emit();
	}

}
