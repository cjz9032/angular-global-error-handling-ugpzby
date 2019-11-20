import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleLoaderComponent } from './simple-loader/simple-loader.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TryProductBlockComponent } from './try-product-block/try-product-block.component';
import { InlineSvgComponent } from './inline-svg/inline-svg.component';
import { PipesModule } from '../pipes/pipes.module';
import { SanitizeModule } from 'src/app/modules/sanitize.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../directives/directives.module';
import { BigLoaderComponent } from './big-loader/big-loader.component';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { FeatureHeaderComponent } from './feature-header/feature-header.component';
import { AccountsStoredComponent } from './accounts-stored/accounts-stored.component';
import { DidYouKnowComponent } from './did-you-know/did-you-know.component';
import { BigPitchComponent } from './big-pitch/big-pitch.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipComponent } from './tooltip/tooltip.component';
import { WhySeeingTooltipComponent } from './why-seeing-tooltip/why-seeing-tooltip.component';
import { OfflineModeComponent } from './offline-mode/offline-mode.component';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { ClearDataTooltipComponent } from './clear-data-tooltip/clear-data-tooltip.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { AbTestsComponent } from './ab-tests/ab-tests.component';

@NgModule({
	declarations: [
		SimpleLoaderComponent,
		CommonPopupComponent,
		TryProductBlockComponent,
		InlineSvgComponent,
		BigLoaderComponent,
		NavTabsComponent,
		FeatureHeaderComponent,
		AccountsStoredComponent,
		DidYouKnowComponent,
		BigPitchComponent,
		SpinnerComponent,
		TooltipComponent,
		WhySeeingTooltipComponent,
		OfflineModeComponent,
		ClearDataTooltipComponent,
		InfiniteScrollComponent,
		AbTestsComponent
	],
	exports: [
		SimpleLoaderComponent,
		CommonPopupComponent,
		TryProductBlockComponent,
		InlineSvgComponent,
		BigLoaderComponent,
		NavTabsComponent,
		FeatureHeaderComponent,
		AccountsStoredComponent,
		DidYouKnowComponent,
		BigPitchComponent,
		SpinnerComponent,
		TooltipComponent,
		WhySeeingTooltipComponent,
		OfflineModeComponent,
		ClearDataTooltipComponent,
		InfiniteScrollComponent,
		AbTestsComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		PipesModule,
		SanitizeModule,
		RouterModule,
		DirectivesModule,
		FontAwesomeModule,
		AppSearchModule
	]
})
export class ComponentsModule {
}
