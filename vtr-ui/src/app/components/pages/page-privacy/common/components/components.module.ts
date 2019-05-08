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
import { PrivacyScoreComponent } from './privacy-score/privacy-score.component';
import { SupportBannerComponent } from './support-banner/support-banner.component';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../directives/directives.module';
import { BigLoaderComponent } from './big-loader/big-loader.component';

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
		PrivacyScoreComponent,
		SupportBannerComponent,
		BigLoaderComponent,
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
		PrivacyScoreComponent,
		SupportBannerComponent,
		BigLoaderComponent,
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
