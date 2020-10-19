import { Component, Input } from '@angular/core';

export type DashboardStateCardData = {
	linkPath: string;
	title: string;
	summary?: string;
	linkText?: string;
	statusText?: string;
	params?: string;
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

}
