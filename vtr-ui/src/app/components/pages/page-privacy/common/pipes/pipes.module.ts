import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesFaviconPipe } from './sites-favicon.pipe';
import { ObjectValuesPipe } from './object-values.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
	declarations: [
		SitesFaviconPipe,
		ObjectValuesPipe,
		SafeHtmlPipe
	],
	exports: [
		SitesFaviconPipe,
		ObjectValuesPipe,
		SafeHtmlPipe
	],
	imports: [
		CommonModule
	]
})
export class PipesModule {
}
