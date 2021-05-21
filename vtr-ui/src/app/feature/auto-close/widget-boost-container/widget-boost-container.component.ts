import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-boost-container',
	templateUrl: './widget-boost-container.component.html',
	styleUrls: ['./widget-boost-container.component.scss'],
})
export class WidgetBoostContainerComponent {
	@Input() featureToggle: boolean;
	@Input() id = 'boost';
}
