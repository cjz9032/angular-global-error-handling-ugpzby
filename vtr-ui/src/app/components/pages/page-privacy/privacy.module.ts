import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pages
import { BreachedAccountsComponent } from './pages/breached-accounts/breached-accounts.component';
import { TrackersComponent } from './pages/trackers/trackers.component';
import { InstalledComponent } from './pages/installed/installed.component';
import { BrowserAccountsComponent } from './pages/browser-accounts/browser-accounts.component';
import { ScanComponent } from './pages/scan/scan.component';
import { ResultComponent } from './pages/result/result.component';
import { TrackingBrowserPopupComponent } from './pages/result/tracking-browser-popup/tracking-browser-popup.component';

// Common UI components
import { SidebarComponent } from './main-layout/sidebar/sidebar.component';
import { CheckBreachesFormComponent } from './common-ui/check-breaches/check-breaches-form.component';
import { PageBannerComponent } from './common-ui/page-banner/page-banner.component';
import { PrivacyScoreComponent } from './common-ui/privacy-score/privacy-score.component';

// Main Layout Components
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainHeaderComponent } from './main-layout/main-header/main-header.component';

import { PrivacyRoutingModule } from './privacy-routing.module';
// import {ScanModule} from "./pages/scan/scan.module";
// import { ResultModule } from './pages/result/result.module';
import { ServerCommunicationService } from './common-services/server-communication.service';
import { SidebarPreviewComponent } from './main-layout/sidebar/sidebar-preview/sidebar-preview.component';
import { FaqComponent } from './main-layout/sidebar/faq/faq.component';
import { BreachedAccountComponent } from './common-ui/breached-account/breached-account.component';

@NgModule({
	imports: [
		PrivacyRoutingModule,
		CommonModule,
		// ScanModule,
		// ResultModule,
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
		TrackingBrowserPopupComponent, // result page
		// Common UI components
		SidebarComponent,
		CheckBreachesFormComponent,
		SidebarPreviewComponent,
		PageBannerComponent,
		PrivacyScoreComponent,
		FaqComponent,
		BreachedAccountComponent,
	],
	providers: [ServerCommunicationService],
})
export class PrivacyModule {
}
