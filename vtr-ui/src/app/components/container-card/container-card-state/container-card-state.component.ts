import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

export interface CardData {
	linkPath: string;
	title: string;
	summary?: string;
	linkText?: string;
}

@Component({
	selector: 'vtr-container-card-state',
	templateUrl: './container-card-state.component.html',
	styleUrls: ['./container-card-state.component.scss']
})
export class ContainerCardStateComponent extends BaseComponent implements OnInit {
	@Input() cardData: CardData;
	@Input() order: string;
	@Input() cardId: string;

	constructor() { super(); }

	ngOnInit(): void {	}

}
