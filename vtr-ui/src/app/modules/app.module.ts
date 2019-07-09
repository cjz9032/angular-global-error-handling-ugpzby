import { AppComponent } from '../app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { SharedModule } from './shared.module';
import { CommonModalModule } from './common-modal.module';
import { CommonUiModule } from './common-ui.module';
import { CommonWidgetModule } from './common-widget.module';
import { TranslationModule } from './translation.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		CommonModalModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		TranslationModule,
		AppRoutingModule,
	],
	exports: [
		CommonModalModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		TranslationModule
	],
	providers: [
		{ provide: ErrorHandler, useClass: GlobalErrorHandler }
	],
	bootstrap: [
		AppComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class AppModule { }
