import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-support',
	templateUrl: './widget-support.component.html',
	styleUrls: ['./widget-support.component.scss']
})
export class WidgetSupportComponent implements OnInit {

	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];
	@Input() widgetTittleId: string;
	@Input() widgetDescriptionId: string;

	constructor() { }

	ngOnInit() {
	}

}
