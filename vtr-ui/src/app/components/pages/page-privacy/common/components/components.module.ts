import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleLoaderComponent } from './simple-loader/simple-loader.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TryProductBlockComponent } from './try-product-block/try-product-block.component';
import { CommonTextComponent } from './common-text/common-text.component';
import { InlineSvgComponent } from './inline-svg/inline-svg.component';
import { LowPrivacyComponent } from './low-privacy/low-privacy.component';
import { SupportBannerComponent } from './support-banner/support-banner.component';
import { PipesModule } from '../pipes/pipes.module';
import { SanitizeModule } from 'src/app/modules/sanitize.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../directives/directives.module';
import { BigLoaderComponent } from './big-loader/big-loader.component';
import { StepsViewComponent } from './steps-view/steps-view.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PermitTrackersAndPasswordsComponent } from './permit-trackers-and-passwords/permit-trackers-and-passwords.component';
import { SupportWidgetComponent } from './support-widget/support-widget.component';
import { SupportPopupComponent } from './support-popup/support-popup.component';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { FeatureHeaderComponent } from './feature-header/feature-header.component';
import { StatComponent } from './privacy-dashboard-list/stat.component';
import { AccountsStoredComponent } from './accounts-stored/accounts-stored.component';
import { DidYouKnowComponent } from './did-you-know/did-you-know.component';
import { BigPitchComponent } from './big-pitch/big-pitch.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipComponent } from './tooltip/tooltip.component';
import { WhySeeingTooltipComponent } from './why-seeing-tooltip/why-seeing-tooltip.component';
import { OfflineModeComponent } from './offline-mode/offline-mode.component';
import { AppSearchModule} from 'src/app/beta/app-search/app-search.module';
import { VideoComponent } from './video/video.component';
import { ClearDataTooltipComponent } from './clear-data-tooltip/clear-data-tooltip.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { AbTestsComponent } from './ab-tests/ab-tests.component';

@NgModule({
	declarations: [
		SimpleLoaderComponent,
		CommonPopupComponent,
		ToggleButtonComponent,
		TryProductBlockComponent,
		CommonTextComponent,
		InlineSvgComponent,
		LowPrivacyComponent,
		SupportBannerComponent,
		BigLoaderComponent,
		StepsViewComponent,
		ProgressBarComponent,
		SupportWidgetComponent,
		SupportPopupComponent,
		NavTabsComponent,
		PermitTrackersAndPasswordsComponent,
		FeatureHeaderComponent,
		StatComponent,
		AccountsStoredComponent,
		DidYouKnowComponent,
		BigPitchComponent,
		SpinnerComponent,
		TooltipComponent,
		WhySeeingTooltipComponent,
		OfflineModeComponent,
		VideoComponent,
		ClearDataTooltipComponent,
		InfiniteScrollComponent,
		AbTestsComponent
	],
	exports: [
		SimpleLoaderComponent,
		CommonPopupComponent,
		ToggleButtonComponent,
		TryProductBlockComponent,
		CommonTextComponent,
		InlineSvgComponent,
		LowPrivacyComponent,
		SupportBannerComponent,
		BigLoaderComponent,
		StepsViewComponent,
		ProgressBarComponent,
		SupportWidgetComponent,
		NavTabsComponent,
		PermitTrackersAndPasswordsComponent,
		SupportWidgetComponent,
		FeatureHeaderComponent,
		StatComponent,
		AccountsStoredComponent,
		DidYouKnowComponent,
		BigPitchComponent,
		SpinnerComponent,
		TooltipComponent,
		WhySeeingTooltipComponent,
		OfflineModeComponent,
		VideoComponent,
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
