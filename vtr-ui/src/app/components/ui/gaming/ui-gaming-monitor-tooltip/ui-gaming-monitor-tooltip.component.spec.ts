import { TestBed, inject } from '@angular/core/testing';

import { UiGamingMonitorTooltipComponent } from './ui-gaming-monitor-tooltip.component';

describe('a ui-gaming-monitor-tooltip component', () => {
	let component: UiGamingMonitorTooltipComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UiGamingMonitorTooltipComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([UiGamingMonitorTooltipComponent], (UiGamingMonitorTooltipComponent) => {
		component = UiGamingMonitorTooltipComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});