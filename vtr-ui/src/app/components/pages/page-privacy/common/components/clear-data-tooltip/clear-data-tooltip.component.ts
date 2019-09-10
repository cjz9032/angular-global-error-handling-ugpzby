import { Component, Input, ViewChild } from '@angular/core';
import { Features } from '../nav-tabs/nav-tabs.service';
import { ClearDataService } from './clear-data.service';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
	selector: 'vtr-clear-data-tooltip',
	templateUrl: './clear-data-tooltip.component.html',
	styleUrls: ['./clear-data-tooltip.component.scss']
})
export class ClearDataTooltipComponent {
	@Input() feature: Features;
	@ViewChild('tooltip', { static: false }) tooltip: TooltipComponent;

	constructor(private clearDataService: ClearDataService) {
	}

	clearData() {
		this.clearDataService.clearData(this.feature);
	}

	closeTooltip() {
		this.tooltip.hideContextByClick();
	}

}
