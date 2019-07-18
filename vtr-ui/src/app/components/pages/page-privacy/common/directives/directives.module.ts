import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { OpenFigleafInstallerDirective } from './open-figleaf-installer.directive';
import { SendAnalyticsDirective } from './send-analytics.directive';
import { CutMultilineTextWithDotsDirective } from './cut-multiline-text-with-dots/cut-multiline-text-with-dots.directive';
import { OpenSeePlansDirective } from './open-see-plans.directive';
import { OfflineModeDirective } from './offline-mode/offline-mode.directive';

@NgModule({
	declarations: [
		NumbersOnlyDirective,
		OpenFigleafInstallerDirective,
		SendAnalyticsDirective,
		CutMultilineTextWithDotsDirective,
		OpenSeePlansDirective,
		OfflineModeDirective
	],
	exports: [
		NumbersOnlyDirective,
		OpenFigleafInstallerDirective,
		SendAnalyticsDirective,
		CutMultilineTextWithDotsDirective,
		OpenSeePlansDirective,
		OfflineModeDirective
	],
	imports: [
		CommonModule
	]
})
export class DirectivesModule {
}
