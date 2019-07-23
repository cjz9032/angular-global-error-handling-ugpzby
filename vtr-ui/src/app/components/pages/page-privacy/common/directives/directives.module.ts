import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { OpenFigleafInstallerDirective } from './open-figleaf-installer.directive';
import { SendAnalyticsDirective } from './send-analytics.directive';
import { CutMultilineTextWithDotsDirective } from './cut-multiline-text-with-dots/cut-multiline-text-with-dots.directive';
import { OpenSeePlansDirective } from './open-see-plans.directive';
import { OpenLinkInBrowserDirective } from './open-link-in-browser.directive';

@NgModule({
	declarations: [
		NumbersOnlyDirective,
		OpenFigleafInstallerDirective,
		SendAnalyticsDirective,
		CutMultilineTextWithDotsDirective,
		OpenSeePlansDirective,
		OpenLinkInBrowserDirective
	],
	exports: [
		NumbersOnlyDirective,
		OpenFigleafInstallerDirective,
		OpenLinkInBrowserDirective,
		SendAnalyticsDirective,
		CutMultilineTextWithDotsDirective,
		OpenSeePlansDirective
	],
	imports: [
		CommonModule
	]
})
export class DirectivesModule {
}
