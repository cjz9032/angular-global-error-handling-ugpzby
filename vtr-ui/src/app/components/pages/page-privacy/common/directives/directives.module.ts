import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { OpenFigleafInstallerDirective } from './open-figleaf-installer.directive';
import { SendAnalyticsDirective } from './send-analytics.directive';
import { CutMultilineTextWithDotsDirective } from './cut-multiline-text-with-dots/cut-multiline-text-with-dots.directive';
import { OpenSeePlansDirective } from './open-see-plans.directive';
import { OpenLinkInBrowserDirective } from './open-link-in-browser.directive';
import { ClickOutsideDirective } from './click-outside.directive';

@NgModule({
	declarations: [
		NumbersOnlyDirective,
		OpenFigleafInstallerDirective,
		SendAnalyticsDirective,
		CutMultilineTextWithDotsDirective,
		OpenSeePlansDirective,
		OpenLinkInBrowserDirective,
		ClickOutsideDirective
	],
	exports: [
		NumbersOnlyDirective,
		OpenFigleafInstallerDirective,
		OpenLinkInBrowserDirective,
		SendAnalyticsDirective,
		CutMultilineTextWithDotsDirective,
		OpenSeePlansDirective,
		ClickOutsideDirective
	],
	imports: [
		CommonModule
	]
})
export class DirectivesModule {
}
