import { Component, Input } from '@angular/core';

interface IntroDetails {
	mark?: string;
	iconName?: any;
	detail: string;
}

export interface FeatureIntroduction {
	featureTitle: string;
	featureTitleDesc?: string;
	descHasLink?: boolean;
	imgSrc: string;
	imgAlt?: string;
	featureSubtitle?: string;
	featureIntroList: IntroDetails[];
}

@Component({
	selector: 'vtr-ui-feature-introduction',
	templateUrl: './ui-feature-introduction.component.html',
	styleUrls: ['./ui-feature-introduction.component.scss'],
})
export class UiFeatureIntroductionComponent {
	@Input() items: FeatureIntroduction;
	@Input() textId = '';
	@Input() reverse = false;
}
