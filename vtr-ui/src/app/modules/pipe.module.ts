import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UniqueIdPipe } from '../pipe/unique-id.pipe';
import { CommonModule } from '@angular/common';
import { SvgInlinePipe } from '../pipe/svg-inline/svg-inline.pipe';


@NgModule({
	declarations: [
		UniqueIdPipe,
		SvgInlinePipe
	],
	exports: [
		UniqueIdPipe,
		SvgInlinePipe
	],
	imports: [
		// CommonModule,
	],
	providers: [

	],
	entryComponents: [
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class PipeModule { }
