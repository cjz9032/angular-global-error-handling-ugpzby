import { Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-intelligent-boost',
	templateUrl: './widget-intelligent-boost.component.html',
	styleUrls: ['./widget-intelligent-boost.component.scss']
})
export class WidgetIntelligentBoostComponent {
	@Input() featureToggle: boolean;
}
