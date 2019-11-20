import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonPrivatePasswordComponent } from './non-private-password.component';
import { BrowserStoredAccountsComponent } from './browser-stored-accounts/browser-stored-accounts.component';
import { InstalledBrowserComponent } from './browser-stored-accounts/installed-browser/installed-browser.component';
import { RouterModule } from '@angular/router';
import { VtrCoreModule } from '../../core/vtr-core.module';
import { RemovePasswordComponent } from './browser-stored-accounts/remove-password/remove-password.component';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
@NgModule({
	declarations: [
		NonPrivatePasswordComponent,
		BrowserStoredAccountsComponent,
		InstalledBrowserComponent,
		RemovePasswordComponent,
	],
	exports: [
		NonPrivatePasswordComponent,
		BrowserStoredAccountsComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		VtrCoreModule,
		AppSearchModule
	]
})
export class NonPrivatePasswordModule {
}
