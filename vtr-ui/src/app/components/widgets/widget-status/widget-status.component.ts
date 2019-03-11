import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-widget-status',
	templateUrl: './widget-status.component.html',
	styleUrls: ['./widget-status.component.scss']
})
export class WidgetStatusComponent implements OnInit {

	@Input() type: string = this.type || 'system';
	@Input() title: string = this.title || '';
	@Input() description: string = this.description || '';
	@Input() items: any[];

	constructor() {
	}

	ngOnInit() {
		console.log('items' + this.items);
	}
}
