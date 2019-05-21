import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-lighting',
	templateUrl: './widget-lighting.component.html',
	styleUrls: ['./widget-lighting.component.scss']
})
export class WidgetLightingComponent implements OnInit {

	@Input() title = '';

	constructor() { }

	ngOnInit() {
	}

}
