import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-warranty',
	templateUrl: './widget-warranty.component.html',
	styleUrls: ['./widget-warranty.component.scss']
})
export class WidgetWarrantyComponent implements OnInit {

	@Input() item: any;

	status = {
		title: ['IN WARRANTY', 'WARRANTY EXPIRED', 'Not Found Warranty'],
		detail: ['In warranty', 'Expired', 'Not found warranty']
	};

	constructor() { }

	ngOnInit() {
	}

	dateFormat(date: Date) {
		const sdate = new Date(date);
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
