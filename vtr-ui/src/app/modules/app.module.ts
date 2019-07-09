import { AppComponent } from '../app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { SharedModule } from './shared.module';
import { CommonPipeModule } from './common-pipe.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		SharedModule,
		AppRoutingModule,
		CommonPipeModule
	],
	providers: [
		{ provide: ErrorHandler, useClass: GlobalErrorHandler }
	],
	bootstrap: [
		AppComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	entryComponents: [
	]
})
export class AppModule { }
