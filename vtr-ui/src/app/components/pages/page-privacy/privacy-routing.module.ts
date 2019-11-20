import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAccountsComponent } from './pages/browser-accounts/browser-accounts.component';
import { BreachedAccountsComponent } from './pages/breached-accounts/breached-accounts.component';
import { TrackersComponent } from './pages/trackers/trackers.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LandingComponent } from './pages/landing/landing.component';
import { RoutersName } from './privacy-routing-name';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ArticleSingleComponent } from './pages/articles/article-single/article-single.component';
import { IsOnlineGuard } from './core/guards/is-online.guard';

const adminRoutes: Routes = [
	{
		path: RoutersName.MAIN,
		component: MainLayoutComponent,
		pathMatch: 'prefix',
		children: [
			{
				path: RoutersName.MAIN, // /privacy
				redirectTo: RoutersName.BREACHES,
			}, {
				path: RoutersName.BREACHES,
				component: BreachedAccountsComponent
			}, {
				path: RoutersName.TRACKERS,
				component: TrackersComponent,
			}, {
				path: RoutersName.BROWSERACCOUNTS,
				component: BrowserAccountsComponent
			}, {
				path: RoutersName.LANDING,
				component: LandingComponent
			}, {
				path: RoutersName.ARTICLES,
				component: ArticlesComponent,
				canActivate: [IsOnlineGuard]
			}, {
				path: `${RoutersName.ARTICLEDETAILS}`,
				component: ArticleSingleComponent
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
