import { Component, Input } from '@angular/core';
import { Features } from '../nav-tabs/nav-tabs.service';
import { ClearDataService } from './clear-data.service';

@Component({
	selector: 'vtr-clear-data-tooltip',
	templateUrl: './clear-data-tooltip.component.html',
	styleUrls: ['./clear-data-tooltip.component.scss']
})
export class ClearDataTooltipComponent {
	@Input() feature: Features;

	constructor(private clearDataService: ClearDataService) {
	}

	clearData() {
		this.clearDataService.clearData(this.feature);
	}

}
