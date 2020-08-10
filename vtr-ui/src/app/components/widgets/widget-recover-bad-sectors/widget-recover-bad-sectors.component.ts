import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-widget-recover-bad-sectors',
	templateUrl: './widget-recover-bad-sectors.component.html',
	styleUrls: ['./widget-recover-bad-sectors.component.scss']
})
export class WidgetRecoverBadSectorsComponent implements OnInit {

	@Input() widgetId: string;
	@Input() title: string;
	@Input() description: string;
	@Input() recoverPath: string;
	@Input() disable = false;
	@Input() tooltipText: string;

	constructor() { }

	ngOnInit() { }
}
