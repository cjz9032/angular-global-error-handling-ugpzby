import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SitesFaviconPipe } from './sites-favicon.pipe';

@NgModule({
	declarations: [
		SitesFaviconPipe
	],
	exports: [
		SitesFaviconPipe
	],
	imports: [
		CommonModule
	]
})
export class PipesModule {
}
