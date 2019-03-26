import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScanComponent } from './pages/scan/scan.component';
import { ResultComponent } from './pages/result/result.component';
import { InstalledComponent } from './pages/installed/installed.component';
import { BrowserAccountsComponent } from './pages/browser-accounts/browser-accounts.component';
import { BreachedAccountsComponent } from './pages/breached-accounts/breached-accounts.component';
import { TrackersComponent } from './pages/trackers/trackers.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { ChoseBrowserGuard } from './common-guards/chose-browser.guard';
import { TipsListComponent } from './pages/tips-list/tips-list.component';
import { NewsListComponent } from './pages/news-list/news-list.component';

const adminRoutes: Routes = [
	{
		path: '',
		component: MainLayoutComponent,
		children: [
			{
				path: '', // /privacy
				component: ResultComponent,
				pathMatch: 'full'
			}, {
				path: 'scan',
				component: ScanComponent,
				pathMatch: 'full'
			}, {
				path: 'breaches',
				component: BreachedAccountsComponent
			}, {
				path: 'trackers',
				component: TrackersComponent,
				canActivate: [ChoseBrowserGuard]
			}, {
				path: 'result',
				component: ResultComponent
			}, {
				path: 'installed',
				component: InstalledComponent
			}, {
				path: 'browser-accounts',
				component: BrowserAccountsComponent
			}, {
				path: 'faq',
				component: FaqPageComponent
			}, {
				path: 'tips',
				component: TipsListComponent
			}, {
				path: 'news',
				component: NewsListComponent
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
