import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-search-loading-animation',
	templateUrl: './search-loading-animation.component.html',
	styleUrls: ['./search-loading-animation.component.scss'],
})
export class SearchLoadingAnimationComponent {
	@Input() idPrefix: string;


	constructor() {}
}
