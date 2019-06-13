import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-feature-header',
	templateUrl: './feature-header.component.html',
	styleUrls: ['./feature-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureHeaderComponent {
	@Input() isShowCountIssues = false;
	@Input() isFigleafInstalled = false;
	@Input() texts: { title: string, figleafInstalled: string, figleafUninstalled: string };
}
