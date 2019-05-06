import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: ['./widget-system-tools.component.scss']
})
export class WidgetSystemToolsComponent implements OnInit {

	@Input() title = '';

	constructor() { }

	ngOnInit() {
	}

}
