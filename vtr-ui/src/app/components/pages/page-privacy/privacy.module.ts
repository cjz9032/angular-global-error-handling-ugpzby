import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Pages
import { BreachedAccountsComponent } from './pages/breached-accounts/breached-accounts.component';
import { TrackersComponent } from './pages/trackers/trackers.component';
import { InstalledComponent } from './pages/installed/installed.component';
import { BrowserAccountsComponent } from './pages/browser-accounts/browser-accounts.component';
import { ScanComponent } from './pages/scan/scan.component';
import { ResultComponent } from './pages/result/result.component';
import { LandingComponent } from './pages/landing/landing.component';

// Main Layout Components
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainHeaderComponent } from './main-layout/main-header/main-header.component';
import { SidebarComponent } from './main-layout/sidebar/sidebar.component';
// Services
import { VideoPopupService } from './common-services/popups/video-popup.service';
import { TrackersPopupService } from './common-services/popups/trackers-popup.service';
// Modules
import { PrivacyRoutingModule } from './privacy-routing.module';
// Directives
import { NumbersOnlyDirective } from './common-directives/numbers-only.directive';
// Common UI components
import { CheckBreachesFormComponent } from './common-ui/check-breaches/check-breaches-form.component';
import { PageBannerComponent } from './common-ui/page-banner/page-banner.component';
import { PrivacyScoreComponent } from './common-ui/privacy-score/privacy-score.component';

import { SidebarPreviewComponent } from './main-layout/sidebar/sidebar-preview/sidebar-preview.component';
import { FaqComponent } from './main-layout/sidebar/faq/faq.component';
import { BreachedAccountComponent } from './common-ui/breached-account/breached-account.component';
import { SidebarInstallWidgetComponent } from './main-layout/sidebar/sidebar-benefits-widget/sidebar-install-widget.component';
import { BrowserStoredAccountsComponent } from './common-ui/browser-stored-accounts/browser-stored-accounts.component';
import { InstalledBrowserComponent } from './common-ui/installed-browser/installed-browser.component';
import { LightPrivacyBannerComponent } from './common-ui/light-privacy-banner/light-privacy-banner.component';
import { ArticlePromoComponent } from './common-ui/article-promo/article-promo.component';
import { PromoFeaturesListComponent } from './common-ui/promo-features-list/promo-features-list.component';
import { PromoVideoComponent } from './common-ui/promo-video/promo-video.component';
import { ConfirmationPopupComponent } from './common-ui/confirmation-popup/confirmation-popup.component';
import { ScanStepsComponent } from './common-ui/scan-steps/scan-steps.component';
import { PrivacyDashboardListComponent } from './pages/installed/privacy-dashboard-list/privacy-dashboard-list.component';
import { VideoPopupComponent } from './common-ui/video-popup/video-popup.component';
import { SupportBannerComponent } from './common-ui/support-banner/support-banner.component';
import { CommonPopupComponent } from './common-ui/common-popup/common-popup.component';
import { BreachedDescriptionComponent } from './common-ui/breached-description/breached-description.component';
import { LowPrivacyComponent } from './common-ui/low-privacy/low-privacy.component';
import { InlineSvgComponent } from './common-ui/inline-svg/inline-svg.component';
import { SafeHtmlPipe } from './common-pipe/safe-html.pipe';
import { ChoseBrowserComponent } from './common-ui/chose-browser/chose-browser.component';
import { PRIVACY_BASE_URL, PRIVACY_ENVIRONMENT } from './shared/injection-tokens';
import { ChoseBrowserGuard } from './common-guards/chose-browser.guard';
import { ObjectValuesPipe } from './common-pipe/object-values.pipe';
import { TipsListComponent } from './pages/tips-list/tips-list.component';
import { FlTrackingMapModule } from './fl-tracking-map';
import { PrivacyTipComponent } from './common-ui/privacy-tip/privacy-tip.component';
import { NewsItemComponent } from './common-ui/news-item/news-item.component';
import { NewsListComponent } from './pages/news-list/news-list.component';
import { TrackingMapComponent } from './common-ui/tracking-map/tracking-map.component';
import { SingleTrackerDetailComponent } from './common-ui/single-tracker-detail/single-tracker-detail.component';
import { ToggleButtonComponent } from './common-ui/toggle-button/toggle-button.component';
import { SitesFaviconPipe } from './common-pipe/sites-favicon.pipe';
import { getPrivacyEnvironment } from './environment';
import { DataKnowledgeService } from './shared/services/data-knowledge.service';
import { EmailScannerService } from './common-services/email-scanner.service';
import { BreachedAccountsService } from './common-services/breached-accounts.service';
import { CommonTextComponent } from './common-ui/common-text/common-text.component';
import { TryProductBlockComponent } from './common-ui/try-product-block/try-product-block.component';
import { PrivacyScoreService } from './common-ui/privacy-score/privacy-score.service';
import { EmailScannerComponent } from './common-ui/email-scanner/email-scanner.component';
import { SimpleLoaderComponent } from './common-ui/simple-loader/simple-loader.component';
import { OpenFigleafInstallerDirective } from './common-directives/open-figleaf-installer.directive';
import { NonPrivatePasswordComponent } from './common-ui/non-private-password/non-private-password.component';

@NgModule({
	imports: [
		PrivacyRoutingModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		FlTrackingMapModule,
	],
	declarations: [
		// Mail Layout Components
		MainLayoutComponent,
		MainHeaderComponent,
		// Pages
		BreachedAccountsComponent,
		TrackersComponent,
		InstalledComponent,
		BrowserAccountsComponent,
		ScanComponent,
		ResultComponent,
		// Pipes
		SafeHtmlPipe,
		ObjectValuesPipe,
		// Directives
		NumbersOnlyDirective,
		// Common UI components
		SidebarComponent,
		CheckBreachesFormComponent,
		SidebarPreviewComponent,
		PageBannerComponent,
		PrivacyScoreComponent,
		FaqComponent,
		BreachedAccountComponent,
		SidebarInstallWidgetComponent,
		BrowserStoredAccountsComponent,
		InstalledBrowserComponent,
		LightPrivacyBannerComponent,
		ArticlePromoComponent,
		PromoFeaturesListComponent,
		PromoVideoComponent,
		ConfirmationPopupComponent,
		ScanStepsComponent,
		PrivacyDashboardListComponent,
		VideoPopupComponent,
		SupportBannerComponent,
		CommonPopupComponent,
		BreachedDescriptionComponent,
		LowPrivacyComponent,
		InlineSvgComponent,
		SafeHtmlPipe,
		ChoseBrowserComponent,
		TipsListComponent,
		PrivacyTipComponent,
		NewsItemComponent,
		NewsListComponent,
		TrackingMapComponent,
		SingleTrackerDetailComponent,
		ToggleButtonComponent,
		SitesFaviconPipe,
		LandingComponent,
		CommonTextComponent,
		TryProductBlockComponent,
		SimpleLoaderComponent,
		EmailScannerComponent,
		OpenFigleafInstallerDirective,
		NonPrivatePasswordComponent,
	],
	providers: [
		TrackersPopupService,
		VideoPopupService,
		{
			provide: PRIVACY_BASE_URL,
			useValue: 'privacy'
		},
		{
			provide: PRIVACY_ENVIRONMENT,
			useValue: getPrivacyEnvironment()
		},
		ChoseBrowserGuard,
		DataKnowledgeService,
		EmailScannerService,
		BreachedAccountsService,
		PrivacyScoreService,
	],
})
export class PrivacyModule {
}
