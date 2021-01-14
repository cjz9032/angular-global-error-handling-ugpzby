import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-auto-close',
	templateUrl: './widget-auto-close.component.html',
	styleUrls: ['./widget-auto-close.component.scss']
})
export class WidgetAutoCloseComponent {
	@Input() featureToggle: boolean;
}
