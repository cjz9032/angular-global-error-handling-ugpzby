import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleLoaderComponent } from './simple-loader/simple-loader.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TryProductBlockComponent } from './try-product-block/try-product-block.component';
import { ChoseBrowserComponent } from './chose-browser/chose-browser.component';
import { CommonTextComponent } from './common-text/common-text.component';
import { InlineSvgComponent } from './inline-svg/inline-svg.component';
import { LowPrivacyComponent } from './low-privacy/low-privacy.component';
import { SupportBannerComponent } from './support-banner/support-banner.component';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../directives/directives.module';
import { BigLoaderComponent } from './big-loader/big-loader.component';
import { StepsViewComponent } from './steps-view/steps-view.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PermitTrackersAndPasswordsComponent } from './permit-trackers-and-passwords/permit-trackers-and-passwords.component';
import { SupportWidgetComponent } from './support-widget/support-widget.component';
import { SupportPopupComponent } from './support-popup/support-popup.component';

@NgModule({
	declarations: [
		SimpleLoaderComponent,
		CommonPopupComponent,
		ToggleButtonComponent,
		TryProductBlockComponent,
		ChoseBrowserComponent,
		CommonTextComponent,
		InlineSvgComponent,
		LowPrivacyComponent,
		SupportBannerComponent,
		BigLoaderComponent,
		StepsViewComponent,
		ProgressBarComponent,
		SupportWidgetComponent,
		SupportPopupComponent,
		PermitTrackersAndPasswordsComponent
	],
	exports: [
		SimpleLoaderComponent,
		CommonPopupComponent,
		ToggleButtonComponent,
		TryProductBlockComponent,
		ChoseBrowserComponent,
		CommonTextComponent,
		InlineSvgComponent,
		LowPrivacyComponent,
		SupportBannerComponent,
		BigLoaderComponent,
		StepsViewComponent,
		ProgressBarComponent,
		PermitTrackersAndPasswordsComponent,
		SupportWidgetComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		PipesModule,
		RouterModule,
		DirectivesModule
	]
})
export class ComponentsModule {
}
