import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

@Component({
	selector: 'vtr-widget-status',
	templateUrl: './widget-status.component.html',
	styleUrls: ['./widget-status.component.scss']
})
export class WidgetStatusComponent extends BaseComponent implements OnInit {

	@Input() type: string = this.type || 'system';
	@Input() title: string = this.title || '';
	@Input() description: string = this.description || '';
	@Input() items = [];
	@Input() linkId:string;
	constructor() {
		super();
	}

	ngOnInit() { }
}
