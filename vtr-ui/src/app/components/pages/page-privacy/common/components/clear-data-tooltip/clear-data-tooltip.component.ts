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
	@Input() set feature(feature: Features) {
		this.currentFeature = feature;
		this.currentText = this.clearDataService.getText(feature);
	}
	@ViewChild('tooltip', { static: false }) tooltip: TooltipComponent;

	currentFeature: Features;
	currentText: {text: string, content: string};

	constructor(private clearDataService: ClearDataService) {
	}

	clearData() {
		this.clearDataService.clearData(this.currentFeature);
	}

	closeTooltip() {
		this.tooltip.hideContextByClick();
	}

}
