import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-feature-heading',
	templateUrl: './ui-feature-heading.component.html',
	styleUrls: ['./ui-feature-heading.component.scss'],
})
export class UiFeatureHeadingComponent implements OnInit {
	@Input() featureTitle: string;
	@Input() imgSrc: string;
	@Input() imgAlt: string;
	@Input() description: string;
	@Input() appSearchName: string;
	@Input() textId = '';

	constructor() {}

	ngOnInit(): void {}
}
