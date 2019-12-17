import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-powered-by-info',
	templateUrl: './widget-powered-by-info.component.html',
	styleUrls: ['./widget-powered-by-info.component.scss']
})
export class WidgetPoweredByInfoComponent {
	@Input() title: string;
	@Input() linkId: string;
	@Input() imgUrl: string;
	@Input() detail: string;
	@Input() privacyUrl: string;
	@Input() termsUrl: string;
	constructor() {}

}
