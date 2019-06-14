import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesFaviconPipe } from './sites-favicon.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
	declarations: [
		SitesFaviconPipe,
		SafeHtmlPipe
	],
	exports: [
		SitesFaviconPipe,
		SafeHtmlPipe
	],
	imports: [
		CommonModule
	]
})
export class PipesModule {
}
