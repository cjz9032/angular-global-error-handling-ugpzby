import { CommonService, } from './../../../services/common/common.service';
import { OnInit, Input, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'vtr-widget-dashboard-warranty',
	templateUrl: './widget-dashboard-warranty.component.html',
	styleUrls: [ './widget-dashboard-warranty.component.scss' ]
})
export class WidgetDashboardWarrantyComponent implements OnInit {
	@Input() item: any;
	@Input() isConnected: boolean;
	public pageParent: string;
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

	constructor(private commonService: CommonService, private activatedRoute: ActivatedRoute) {}

	ngOnInit() {
		try {
			this.pageParent = this.activatedRoute.snapshot.data.pageName;
		} catch (ex) {}
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
		if ((date instanceof Date) === false) {
			date = new Date(date);
		}
		return this.commonService.formatDate(date.toISOString());
	}
}
