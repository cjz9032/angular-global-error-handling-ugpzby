import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoseBrowserGuard } from './chose-browser.guard';

@NgModule({
	declarations: [],
	imports: [
		CommonModule
	],
	providers: [
		ChoseBrowserGuard
	]
})
export class GuardsModule {
}
