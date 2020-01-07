import { Component, OnInit, Input } from '@angular/core';
import { SupportService } from 'src/app/services/support/support.service';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-ui-list-support',
	templateUrl: './ui-list-support.component.html',
	styleUrls: ['./ui-list-support.component.scss']
})
export class UiListSupportComponent implements OnInit {

	@Input() items: any[];

	constructor(
		private supportService: SupportService,
	) { }

	ngOnInit() {
	}

	itemClick(item: any, event: any) {
		if (item.url) {
			WinRT.launchUri(item.url);
		} else if (item.clickItem) {
			this.supportService.widgetItemClick(item.clickItem);
		}
		event.stopPropagation();
		event.preventDefault();
	}

}
