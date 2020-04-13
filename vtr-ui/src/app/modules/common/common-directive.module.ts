import { AppEventDirective } from 'src/app/directives/app-event.directive';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LinkStatusDirective } from 'src/app/directives/link-status.directive';
import { OutsideclickDirective } from 'src/app/directives/outsideclick.directive';
import { TranslateDirective } from 'src/app/directives/translate.directive';
import { UiDropdownNavigate } from 'src/app/directives/ui-dropdown-directive/ui-dropdown-navigate.directive';

@NgModule({
	declarations: [
		AppEventDirective,
		OutsideclickDirective,
		TranslateDirective,
		LinkStatusDirective,
		UiDropdownNavigate
	],
	exports: [
		AppEventDirective,
		OutsideclickDirective,
		TranslateDirective,
		LinkStatusDirective,
		UiDropdownNavigate
	],
	imports: [
		CommonModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class CommonDirectiveModule { }
