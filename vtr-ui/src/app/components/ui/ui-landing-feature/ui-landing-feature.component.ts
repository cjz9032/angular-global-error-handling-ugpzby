import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-landing-feature',
	templateUrl: './ui-landing-feature.component.html',
	styleUrls: ['./ui-landing-feature.component.scss'],
})
export class UiLandingFeatureComponent implements OnInit {
	@Input() feature: any;
	constructor() {}

	ngOnInit() {}
}
