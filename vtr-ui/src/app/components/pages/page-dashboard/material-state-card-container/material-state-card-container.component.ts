import { Component, Input } from '@angular/core';
import { WinRT } from '@lenovo/tan-client-bridge';

export type DashboardStateCardData = {
	linkPath: string;
	title: string;
	summary?: string;
	linkText?: string;
	statusText?: string;
	params?: string;
	state?: number;
	metricsItem?: string;
	isActionLink: boolean;
};

@Component({
	selector: 'vtr-material-state-card-container',
	templateUrl: './material-state-card-container.component.html',
	styleUrls: ['./material-state-card-container.component.scss']
})
export class MaterialStateCardContainerComponent {
	@Input() cardData: DashboardStateCardData;
	@Input() order: string;
	@Input() cardId: string;

	public onClick(linkPath, params){
		if (WinRT.launchUri && linkPath) {
			WinRT.launchUri(linkPath);
		}
	}

}
