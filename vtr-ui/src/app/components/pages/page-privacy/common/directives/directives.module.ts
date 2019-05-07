import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { OpenFigleafInstallerDirective } from './open-figleaf-installer.directive';
import { SendAnalyticsDirective } from './send-analytics.directive';

@NgModule({
	declarations: [
		NumbersOnlyDirective,
		OpenFigleafInstallerDirective,
		SendAnalyticsDirective
	],
	exports: [
		NumbersOnlyDirective,
		OpenFigleafInstallerDirective,
		SendAnalyticsDirective
	],
	imports: [
		CommonModule
	]
})
export class DirectivesModule {
}
