import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultComponent } from './pages/result/result.component';
import { BrowserAccountsComponent } from './pages/browser-accounts/browser-accounts.component';
import { BreachedAccountsComponent } from './pages/breached-accounts/breached-accounts.component';
import { TrackersComponent } from './pages/trackers/trackers.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LandingComponent } from './pages/landing/landing.component';
import { RoutersName } from './privacy-routing-name';
import { ChoseBrowserGuard } from './common/guards/chose-browser.guard';

const adminRoutes: Routes = [
	{
		path: RoutersName.PRIVACY,
		component: MainLayoutComponent,
		children: [
			{
				path: RoutersName.MAIN, // /privacy
				component: ResultComponent,
			}, {
				path: RoutersName.BREACHES,
				component: BreachedAccountsComponent
			}, {
				path: RoutersName.TRACKERS,
				component: TrackersComponent,
				canActivate: [ChoseBrowserGuard]
			}, {
				path: RoutersName.BROWSERACCOUNTS,
				component: BrowserAccountsComponent
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
