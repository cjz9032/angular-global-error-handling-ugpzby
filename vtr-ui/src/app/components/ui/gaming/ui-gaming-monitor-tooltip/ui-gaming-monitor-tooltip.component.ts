import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-gaming-monitor-tooltip',
	templateUrl: './ui-gaming-monitor-tooltip.component.html',
	styleUrls: ['./ui-gaming-monitor-tooltip.component.scss'],
})
export class UiGamingMonitorTooltipComponent implements OnInit {
	// ver (version) : 0 for default, legacy layout, only title; 1 for x60 oc
	@Input() ver = 0;
	// pos (position): 0 for default, center; 1 for left; 2 for right
	@Input() pos = 0;

	@Input() tooltip = '';

	@Input() info: any = {
		// isOverClocking: false,
		// modal: 'Genuine Intel(R) CPU 0000 @ 2.40Ghz',
		// frequency: '2.4/4.3Ghz',
		// usage: '63%',
		// isSupportOCFeature: true
	};

	ngOnInit() {}
}
