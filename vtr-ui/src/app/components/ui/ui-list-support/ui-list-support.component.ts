import { Component, OnInit, Input } from '@angular/core';
import { SupportService } from 'src/app/services/support/support.service';

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

	itemClick(clickItem: string) {
		this.supportService.widgetItemClick(clickItem);
	}

}
