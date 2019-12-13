import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbTestsComponent } from './ab-tests.component';
import { TestOptionDirective } from './test-option.directive';

@NgModule({
	declarations: [
		AbTestsComponent,
		TestOptionDirective
	],
	exports: [
		AbTestsComponent,
		TestOptionDirective
	],
	imports: [
		CommonModule
	]
})
export class AbTestsModule {
}
