import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';

export interface CardData {
	linkPath: string;
	title: string;
	summary?: string;
	linkText?: string;
}

@Component({
	selector: 'vtr-material-state-card-container',
	templateUrl: './material-state-card-container.component.html',
	styleUrls: ['./material-state-card-container.component.scss']
})
export class MaterialStateCardContainerComponent extends BaseComponent implements OnInit {
	@Input() cardData: CardData;
	@Input() order: string;
	@Input() cardId: string;

	constructor() { super(); }

	ngOnInit(): void {	}

}
