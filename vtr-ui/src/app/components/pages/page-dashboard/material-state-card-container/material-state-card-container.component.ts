import { Component, Input } from '@angular/core';
import { DashboardStateCardData } from 'src/app/interface/dashboard-state-container-card.interface';
import { BaseComponent } from '../../../base/base.component';

@Component({
	selector: 'vtr-material-state-card-container',
	templateUrl: './material-state-card-container.component.html',
	styleUrls: ['./material-state-card-container.component.scss']
})
export class MaterialStateCardContainerComponent extends BaseComponent {
	@Input() cardData: DashboardStateCardData;
	@Input() order: string;
	@Input() cardId: string;

	constructor() { super(); }

}
