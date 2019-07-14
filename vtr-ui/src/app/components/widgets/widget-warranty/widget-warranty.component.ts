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

	dateFormat(date: Date) {
		// const sdate = date;
		// const op = '/';
		// const year = sdate.getFullYear();
		// let month: any = sdate.getMonth() + 1;
		// let day: any = sdate.getDate();
		// if (month >= 1 && month <= 9) { month = `0${month}`; }
		// if (day >= 0 && day <= 9) { day = `0${day}`; }
		// const currentdate = year + op + month + op + day;
		// return currentdate;

		return this.commonService.formatDate(date.toISOString());
	}
}
