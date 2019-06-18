import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-feature-header',
	templateUrl: './feature-header.component.html',
	styleUrls: ['./feature-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureHeaderComponent {
	@Input() isFeatureWasScanned = false;
	@Input() isFigleafReadyToCommunication = false;
	@Input() countOfIssue = 0;
	@Input() texts: {
		title: string,
		figleafTitle: string,
		figleafInstalled: string,
		figleafUninstalled: string,
		noIssuesTitle: string,
		noIssuesDescription: string
	};
}
