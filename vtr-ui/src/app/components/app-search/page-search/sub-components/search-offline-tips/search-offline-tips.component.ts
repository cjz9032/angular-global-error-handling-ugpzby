import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-search-offline-tips',
	templateUrl: './search-offline-tips.component.html',
	styleUrls: ['./search-offline-tips.component.scss'],
})
export class SearchOfflineTipsComponent {
	@Input() idPrefix: string;

	constructor() {}
}
