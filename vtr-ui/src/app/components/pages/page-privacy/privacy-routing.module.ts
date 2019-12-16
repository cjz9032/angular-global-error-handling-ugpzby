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
import { PrivacyGuard } from 'src/app/services/guard/privacy-guard';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonSmodeGuard } from 'src/app/services/guard/non-smode-guard';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { NonGamingGuard } from 'src/app/services/guard/non-gaming-guard';
import { NonCommercialGuard } from 'src/app/services/guard/non-commercial-guard';

const adminRoutes: Routes = [
	{
		path: RoutersName.MAIN,
		component: MainLayoutComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService,
			NonSmodeGuard,
			NonArmGuard,
			NonGamingGuard,
			NonCommercialGuard,
			PrivacyGuard],
		pathMatch: 'prefix',
		children: [
			{
				path: RoutersName.MAIN, // /privacy
				redirectTo: RoutersName.BREACHES,
				canDeactivate: [GuardService],
				canActivate: [GuardService,
					NonSmodeGuard,
					NonArmGuard,
					NonGamingGuard,
					NonCommercialGuard,
					PrivacyGuard],
			}, {
				path: RoutersName.BREACHES,
				component: BreachedAccountsComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService,
					NonSmodeGuard,
					NonArmGuard,
					NonGamingGuard,
					NonCommercialGuard,
					PrivacyGuard],
			}, {
				path: RoutersName.TRACKERS,
				component: TrackersComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService,
					NonSmodeGuard,
					NonArmGuard,
					NonGamingGuard,
					NonCommercialGuard,
					PrivacyGuard],
			}, {
				path: RoutersName.BROWSERACCOUNTS,
				component: BrowserAccountsComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService,
					NonSmodeGuard,
					NonArmGuard,
					NonGamingGuard,
					NonCommercialGuard,
					PrivacyGuard],
			}, {
				path: RoutersName.LANDING,
				component: LandingComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService,
					NonSmodeGuard,
					NonArmGuard,
					NonGamingGuard,
					NonCommercialGuard,
					PrivacyGuard],
			}, {
				path: RoutersName.ARTICLES,
				component: ArticlesComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService,
					NonSmodeGuard,
					NonArmGuard,
					NonGamingGuard,
					IsOnlineGuard,
					NonCommercialGuard,
					PrivacyGuard],
			}, {
				path: `${RoutersName.ARTICLEDETAILS}`,
				component: ArticleSingleComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService,
					NonSmodeGuard,
					NonArmGuard,
					NonGamingGuard,
					NonCommercialGuard,
					PrivacyGuard],
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
