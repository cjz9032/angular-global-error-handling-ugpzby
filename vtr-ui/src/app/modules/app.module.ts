import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';

import { AppComponent } from '../app.component';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { SharedModule } from './shared.module';
import { TranslationModule } from './translation.module';
import { NonGamingRoutingModule } from './non-gaming-routing.module';

// THIRD PARTY MODULES

@NgModule({
	declarations: [
		AppComponent,
		// ModalWelcomeComponent
	],
	imports: [
		BrowserModule,
		SharedModule,
		NonGamingRoutingModule
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
		// ModalWelcomeComponent
	]
})
export class AppModule { }
