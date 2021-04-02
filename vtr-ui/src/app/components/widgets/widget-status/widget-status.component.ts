import { Component, Input, OnInit } from '@angular/core';
import { Status } from 'src/app/data-models/widgets/status.model';
import { BaseComponent } from '../../base/base.component';

@Component({
	selector: 'vtr-widget-status',
	templateUrl: './widget-status.component.html',
	styleUrls: ['./widget-status.component.scss'],
})
export class WidgetStatusComponent extends BaseComponent implements OnInit {
	@Input() title = '';
	@Input() description = '';
	@Input() items: Status[];
	@Input() linkId: string;
	constructor() {
		super();
	}

	ngOnInit() {}
}
