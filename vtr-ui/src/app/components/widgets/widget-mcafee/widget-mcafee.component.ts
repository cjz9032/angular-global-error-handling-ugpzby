import { Component, OnInit, Input } from '@angular/core';


@Component({
	selector: 'vtr-widget-mcafee',
	templateUrl: './widget-mcafee.component.html',
	styleUrls: ['./widget-mcafee.component.scss'],
})
export class WidgetMcafeeComponent implements OnInit {

	@Input() install: any;
	@Input() name: string;
	@Input() mcafee: any;
	urlGetMcAfee = 'https://home.mcafee.com/root/campaign.aspx?cid=233426'; // todo
	constructor() { }

	ngOnInit() {
	}

}



