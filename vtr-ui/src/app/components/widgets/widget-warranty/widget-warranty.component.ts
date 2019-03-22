import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-warranty',
	templateUrl: './widget-warranty.component.html',
	styleUrls: ['./widget-warranty.component.scss']
})
export class WidgetWarrantyComponent implements OnInit {

	@Input() item: any;

	status = {
		title: ['IN WARRANTY', 'WARRANTY EXPIRED', 'Warranty Not Found'],
		detail: ['In warranty', 'Expired', 'Warranty not found']
	};

	constructor() { }

	ngOnInit() {
	}

	getRoundYear(dayDiff: number) {
		return dayDiff > 0 ? Math.round(dayDiff / 365) : 0;
	}

	dateFormat(date: any) {
		const sdate = date;
		const op = '-';
		const year = sdate.getFullYear();
		let month: any = sdate.getMonth() + 1;
		let day: any = sdate.getDate();
		if (month >= 1 && month <= 9) { month = `0${month}`; }
		if (day >= 0 && day <= 9) { day = `0${day}`; }
		const currentdate = year + op + month + op + day;
		return currentdate;
	}
}
