import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Pages
import { BreachedAccountsComponent } from './pages/breached-accounts/breached-accounts.component';
import { TrackersComponent } from './pages/trackers/trackers.component';
import { BrowserAccountsComponent } from './pages/browser-accounts/browser-accounts.component';
import { LandingComponent } from './pages/landing/landing.component';
// Main Layout Components
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainHeaderComponent } from './main-layout/main-header/main-header.component';
import { SidebarComponent } from './main-layout/sidebar/sidebar.component';
// Modules
import { PrivacyRoutingModule } from './privacy-routing.module';
// Providers
import { httpInterceptorProviders } from 'src/app/providers/net/http-interceptors';
// Directives
// Common UI components
import { FaqComponent } from './main-layout/sidebar/faq/faq.component';
import { SidebarInstallWidgetComponent } from './main-layout/sidebar/sidebar-benefits-widget/sidebar-install-widget.component';
import { CheckBreachedAccountsModule } from './feature/check-breached-accounts/check-breached-accounts.module';
import { TrackingMapModule } from './feature/tracking-map/tracking-map.module';
import { NonPrivatePasswordModule } from './feature/non-private-password/non-private-password.module';
import { VtrCommonModule } from './common/vtr-common.module';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ArticleSingleComponent } from './pages/articles/article-single/article-single.component';
import { ArticlePreviewComponent } from './pages/articles/article-preview/article-preview.component';
import { ArticleSidebarComponent } from './pages/articles/article-sidebar/article-sidebar.component';
import { OneClickScanModule } from './feature/one-click-scan/one-click-scan.module';
import { PrivacyScoreComponent } from './pages/result/privacy-score/privacy-score.component';
import { BrowserAccountHeaderComponent } from './pages/browser-accounts/browser-account-header/browser-account-header.component';
import { ArticleDescriptionComponent } from './pages/articles/article-description/article-description.component';
import { TrialExpiredWidgetComponent } from './main-layout/sidebar/trial-expired-widget/trial-expired-widget.component';
import { OfflineWidgetComponent } from './main-layout/sidebar/offline-widget/offline-widget.component';
import { VideoWidgetComponent } from './main-layout/sidebar/video-widget/video-widget.component';
import { CustomFontAwesomeModule } from './custom-font-awesome.module';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';

@NgModule({
	imports: [
		CustomFontAwesomeModule,
		PrivacyRoutingModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		CheckBreachedAccountsModule,
		TrackingMapModule,
		NonPrivatePasswordModule,
		VtrCommonModule,
		OneClickScanModule,
		AppSearchModule
	],
	declarations: [
		// Mail Layout Components
		MainLayoutComponent,
		MainHeaderComponent,
		// Pages
		BreachedAccountsComponent,
		TrackersComponent,
		BrowserAccountsComponent,
		// Common UI components
		SidebarComponent,
		FaqComponent,
		SidebarInstallWidgetComponent,
		PrivacyScoreComponent,
		LandingComponent,
		ArticlesComponent,
		ArticleSingleComponent,
		ArticlePreviewComponent,
		ArticleSidebarComponent,
		BrowserAccountHeaderComponent,
		ArticleDescriptionComponent,
		TrialExpiredWidgetComponent,
		OfflineWidgetComponent,
		VideoWidgetComponent,
	],
	providers: [
		httpInterceptorProviders
	]
})
export class PrivacyModule {
}
