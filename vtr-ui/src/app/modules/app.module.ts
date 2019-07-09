import { AppComponent } from '../app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { SharedModule } from './shared.module';
import { CommonModalModule } from './common-modal.module';
import { CommonUiModule } from './common-ui.module';
import { CommonWidgetModule } from './common-widget.module';
import { TranslationModule, HttpLoaderFactory } from './translation.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

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
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			},
			isolate: false
		}),
		TranslationModule.forRoot(),
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
