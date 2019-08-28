import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SitesFaviconPipe } from './sites-favicon.pipe';
import { ChangeActionButtonTextPipe } from './change-action-button-text.pipe';

@NgModule({
	declarations: [
		SitesFaviconPipe,
		ChangeActionButtonTextPipe
	],
	exports: [
		SitesFaviconPipe,
		ChangeActionButtonTextPipe
	],
	imports: [
		CommonModule
	]
})
export class PipesModule {
}
