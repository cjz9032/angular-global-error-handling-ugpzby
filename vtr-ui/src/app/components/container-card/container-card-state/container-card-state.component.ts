import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardService } from 'src/app/services/card/card.service';
import { Router, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base/base.component';

@Component({
	selector: 'vtr-container-card-state',
	templateUrl: './container-card-state.component.html',
	styleUrls: ['./container-card-state.component.scss']
})
export class ContainerCardStateComponent extends BaseComponent implements OnInit {
	@Input() ratio = 0.5;
	@Input() cardData: any;

	isOnline = true;
	constructor(private cardService: CardService, public router: Router) { super(); }

	ngOnInit(): void {
	}

	linkClicked(actionType: string, actionLink: string, title: string = '') {
		return this.cardService.linkClicked(actionType, actionLink, false, title);
	}

}
