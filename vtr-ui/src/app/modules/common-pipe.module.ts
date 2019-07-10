import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { CapitalizeFirstPipe } from '../pipe/capitalize-pipe/capitalize-first.pipe';
import { CharacterLimitPipe } from '../pipe/ui-chs-statusbar/character-limit.pipe';
import { JoinclassPipe } from '../pipe/security-wifi/join-class.pipe';
import { MinutesToHourminPipe } from '../pipe/minutes-to-hourmin.pipe';
import { SanitizeModule } from './sanitize.module';
import { SeparatePascalCasePipe } from '../pipe/separate-pascal-case.pipe';
import { StatusTextPipe } from '../pipe/ui-security-statusbar/status-text.pipe';
import { SuccessClassPipe } from '../pipe/security-wifi/success-class.pipe';
import { SvgInlinePipe } from '../pipe/svg-inline/svg-inline.pipe';
import { TextClassPipe } from '../pipe/ui-security-statusbar/text-class.pipe';
import { UniqueIdPipe } from '../pipe/unique-id.pipe';

@NgModule({
	declarations: [
		CapitalizeFirstPipe,
		CharacterLimitPipe,
		JoinclassPipe,
		MinutesToHourminPipe,
		SeparatePascalCasePipe,
		StatusTextPipe,
		SuccessClassPipe,
		SvgInlinePipe,
		TextClassPipe,
		UniqueIdPipe
	],
	exports: [
		CapitalizeFirstPipe,
		CharacterLimitPipe,
		JoinclassPipe,
		MinutesToHourminPipe,
		SanitizeModule,
		SeparatePascalCasePipe,
		StatusTextPipe,
		SuccessClassPipe,
		SvgInlinePipe,
		TextClassPipe,
		UniqueIdPipe,
		SanitizeModule
	],
	imports: [
		SanitizeModule,
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
export class CommonPipeModule { }
