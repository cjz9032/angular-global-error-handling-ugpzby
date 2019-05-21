import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonPrivatePasswordComponent } from './non-private-password.component';
import { BrowserStoredAccountsComponent } from './browser-stored-accounts/browser-stored-accounts.component';
import { InstalledBrowserComponent } from './browser-stored-accounts/installed-browser/installed-browser.component';
import { RouterModule } from '@angular/router';
import { VtrCommonModule } from '../../common/vtr-common.module';

@NgModule({
	declarations: [
		NonPrivatePasswordComponent,
		BrowserStoredAccountsComponent,
		InstalledBrowserComponent,
	],
	exports: [
		NonPrivatePasswordComponent,
		BrowserStoredAccountsComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		VtrCommonModule,
	]
})
export class NonPrivatePasswordModule {
}
