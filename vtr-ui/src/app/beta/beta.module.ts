import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BetaModuleRoutingModule } from './beta-routing.module';
import { BetaComponentComponent } from './beta-component/beta-component.component';
import { SharedModule } from '../modules/shared.module';

@NgModule({
	declarations: [
		BetaComponentComponent
	],
	imports: [
		CommonModule,
		BetaModuleRoutingModule,
		SharedModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class BetaModule {}
