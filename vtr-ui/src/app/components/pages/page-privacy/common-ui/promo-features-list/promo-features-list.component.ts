import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-promo-features-list',
	templateUrl: './promo-features-list.component.html',
	styleUrls: ['./promo-features-list.component.scss']
})
export class PromoFeaturesListComponent implements OnInit {
	@Input() data: Array<{title: string, text: string}>;

	constructor() {
	}

	ngOnInit() {
	}

}
