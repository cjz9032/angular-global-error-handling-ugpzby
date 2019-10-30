import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-widget-warranty',
	templateUrl: './widget-warranty.component.html',
	styleUrls: ['./widget-warranty.component.scss']
})
export class WidgetWarrantyComponent implements OnInit {

	@Input() item: any;
	@Input() isConnected: boolean;

	status = {
		title: [
			'support.warranty.titleInWarranty',
			'support.warranty.titleWarrantyExpired',
			'support.warranty.titleWarrantyNotFound'
		],
		detail: [
			'support.warranty.statusInWarranty',
			'support.warranty.statusWarrantyExpired',
			'support.warranty.statusWarrantyNotFound'
		]
	};

	constructor(private commonService: CommonService) { }

	ngOnInit() {
	}

	getRoundYear(dayDiff: number) {
		return dayDiff > 0 ? Math.round(dayDiff / 365) : 0;
	}
}
