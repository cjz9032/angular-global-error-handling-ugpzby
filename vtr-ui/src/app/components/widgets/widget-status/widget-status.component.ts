import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

@Component({
	selector: 'vtr-widget-status',
	templateUrl: './widget-status.component.html',
	styleUrls: ['./widget-status.component.scss']
})
export class WidgetStatusComponent extends BaseComponent implements OnInit {

	@Input() type: string = 'system';
	@Input() title: string = '';
	@Input() description: string = '';
	@Input() items = [];
	@Input() linkId:string;
	constructor() {
		super();
	}

	ngOnInit() { }
}
