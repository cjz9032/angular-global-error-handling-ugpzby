import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCircleNotch } from '@fortawesome/pro-light-svg-icons/faCircleNotch';
import { SpinnerComponent } from './spinner.component';
@NgModule({
	declarations: [
		SpinnerComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		FontAwesomeModule
	],
	exports: [
		SpinnerComponent
	]
})
export class SpinnerModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCircleNotch);
	}
}
