import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// font awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fal } from '@fortawesome/pro-light-svg-icons';
// Pages
import { BreachedAccountsComponent } from './pages/breached-accounts/breached-accounts.component';
import { TrackersComponent } from './pages/trackers/trackers.component';
import { BrowserAccountsComponent } from './pages/browser-accounts/browser-accounts.component';
import { ResultComponent } from './pages/result/result.component';
import { LandingComponent } from './pages/landing/landing.component';
// Main Layout Components
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainHeaderComponent } from './main-layout/main-header/main-header.component';
import { SidebarComponent } from './main-layout/sidebar/sidebar.component';
// Services
import { VideoPopupService } from './common/services/popups/video-popup.service';
import { TrackersPopupService } from './common/services/popups/trackers-popup.service';
// Modules
import { PrivacyRoutingModule } from './privacy-routing.module';
// Directives
// Common UI components
import { FaqComponent } from './main-layout/sidebar/faq/faq.component';
import { SidebarInstallWidgetComponent } from './main-layout/sidebar/sidebar-benefits-widget/sidebar-install-widget.component';
import { PrivacyDashboardListComponent } from './pages/result/privacy-dashboard-list/privacy-dashboard-list.component';
import { PRIVACY_BASE_URL, PRIVACY_ENVIRONMENT } from './utils/injection-tokens';
import { getPrivacyEnvironment } from './environment';
import { DataKnowledgeService } from './common/services/data-knowledge.service';
import { BreachedAccountsService } from './common/services/breached-accounts.service';
import { PrivacyScoreService } from './common/components/privacy-score/privacy-score.service';
import { CheckBreachedAccountsModule } from './feature/check-breached-accounts/check-breached-accounts.module';
import { TrackingMapModule } from './feature/tracking-map/tracking-map.module';
import { NonPrivatePasswordModule } from './feature/non-private-password/non-private-password.module';
import { VtrCommonModule } from './common/vtr-common.module';
import { UserDataGetStateService } from './common/services/user-data-get-state.service';
import { AnalyticsService } from './common/services/analytics.service';
import { TaskActionService } from './common/services/task-action.service';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ArticleSingleComponent } from './pages/articles/article-single/article-single.component';

library.add(fal);

@NgModule({
	imports: [
		FontAwesomeModule,
		PrivacyRoutingModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		CheckBreachedAccountsModule,
		TrackingMapModule,
		NonPrivatePasswordModule,
		VtrCommonModule
	],
	declarations: [
		// Mail Layout Components
		MainLayoutComponent,
		MainHeaderComponent,
		// Pages
		BreachedAccountsComponent,
		TrackersComponent,
		BrowserAccountsComponent,
		ResultComponent,
		// Common UI components
		SidebarComponent,
		FaqComponent,
		SidebarInstallWidgetComponent,
		PrivacyDashboardListComponent,
		LandingComponent,
		ArticlesComponent,
		ArticleSingleComponent,
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
		DataKnowledgeService,
		BreachedAccountsService,
		PrivacyScoreService,
		UserDataGetStateService,
		AnalyticsService,
		TaskActionService,
	],
})
export class PrivacyModule {
}
