import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from './pipes/pipes.module';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { GuardsModule } from './guards/guards.module';
import { AbTestsModule } from './ab-tests/ab-tests.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		PipesModule,
		ComponentsModule,
		DirectivesModule,
		GuardsModule,
		AbTestsModule
	],
	exports: [
		PipesModule,
		ComponentsModule,
		DirectivesModule,
		GuardsModule,
		AbTestsModule
	]
})
export class VtrCoreModule {
}
