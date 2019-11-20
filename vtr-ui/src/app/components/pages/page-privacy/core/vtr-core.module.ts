import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from './pipes/pipes.module';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { GuardsModule } from './guards/guards.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		PipesModule,
		ComponentsModule,
		DirectivesModule,
		GuardsModule
	],
	exports: [
		PipesModule,
		ComponentsModule,
		DirectivesModule,
		GuardsModule
	]
})
export class VtrCoreModule {
}
