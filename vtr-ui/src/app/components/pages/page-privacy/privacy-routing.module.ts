import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScanComponent } from './pages/scan/scan.component';
import { ResultComponent } from './pages/result/result.component';
import { InstalledComponent } from './pages/installed/installed.component';
import { BrowserAccountsComponent } from './pages/browser-accounts/browser-accounts.component';
import { BreachedAccountsComponent } from './pages/breached-accounts/breached-accounts.component';
import { TrackersComponent } from './pages/trackers/trackers.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ChoseBrowserGuard } from './common-guards/chose-browser.guard';
import { TipsListComponent } from './pages/tips-list/tips-list.component';
import { NewsListComponent } from './pages/news-list/news-list.component';
import { LandingComponent } from './pages/landing/landing.component';
import { RoutersName } from './privacy-routing-name';

const adminRoutes: Routes = [
	{
		path: RoutersName.MAIN,
		component: MainLayoutComponent,
		children: [
			{
				path: RoutersName.MAIN, // /privacy
				component: ResultComponent,
				pathMatch: 'full'
			}, {
				path: RoutersName.SCAN,
				component: ScanComponent,
				pathMatch: 'full'
			}, {
				path: RoutersName.BREACHES,
				component: BreachedAccountsComponent
			}, {
				path: RoutersName.TRACKERS,
				component: TrackersComponent,
				canActivate: [ChoseBrowserGuard]
			}, {
				path: RoutersName.INSTALLED,
				component: InstalledComponent
			}, {
				path: RoutersName.BROWSERACCOUNTS,
				component: BrowserAccountsComponent
			}, {
				path: RoutersName.TIPS,
				component: TipsListComponent
			}, {
				path: RoutersName.NEWS,
				component: NewsListComponent
			}, {
				path: RoutersName.LANDING,
				component: LandingComponent
			}
		]
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(adminRoutes)
	],
	exports: [
		RouterModule
	]
})
export class PrivacyRoutingModule {
}

// export const routing: ModuleWithProviders = RouterModule.forChild(adminRoutes) // able to use with const
