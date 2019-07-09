import { AppComponent } from '../app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { SharedModule } from './shared.module';
import { CommonModalModule } from './common-modal.module';
import { CommonWidgetModule } from './common-widget.module';
import { TranslationModule, HttpLoaderFactory } from './translation.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
// FONT AWESOME
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';


library.add(fas);
library.add(fab);
library.add(far);
library.add(fal);

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		CommonModalModule,
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
		FontAwesomeModule
	],
	exports: [
		CommonModalModule,
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
