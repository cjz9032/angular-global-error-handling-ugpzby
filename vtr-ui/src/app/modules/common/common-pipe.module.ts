import { CapitalizeFirstPipe } from 'src/app/pipe/capitalize-pipe/capitalize-first.pipe';
import { CharacterLimitPipe } from 'src/app/pipe/ui-chs-statusbar/character-limit.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { JoinclassPipe } from 'src/app/pipe/security-wifi/join-class.pipe';
import { MinutesToHourminPipe } from 'src/app/pipe/minutes-to-hourmin.pipe';
import { SanitizeModule } from '../sanitize.module';
import { SeparatePascalCasePipe } from 'src/app/pipe/separate-pascal-case.pipe';
import { StatusTextPipe } from 'src/app/pipe/ui-security-statusbar/status-text.pipe';
import { SuccessClassPipe } from 'src/app/pipe/security-wifi/success-class.pipe';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { TextClassPipe } from 'src/app/pipe/ui-security-statusbar/text-class.pipe';
import { StripTagsPipe } from 'src/app/pipe/strip-tags/strip-tags.pipe';
import { RemoveSpacePipe } from 'src/app/pipe/remove-space/remove-space.pipe';
import { DateFormatPipe } from 'src/app/pipe/date-format/date-format.pipe';
import { HtmlTextPipe } from 'src/app/pipe/html-text/html-text.pipe';

@NgModule({
	declarations: [
		CapitalizeFirstPipe,
		CharacterLimitPipe,
		JoinclassPipe,
		MinutesToHourminPipe,
		SeparatePascalCasePipe,
		StatusTextPipe,
		HtmlTextPipe,
		SuccessClassPipe,
		SvgInlinePipe,
		TextClassPipe,
		StripTagsPipe,
		DateFormatPipe,
		RemoveSpacePipe,
	],
	exports: [
		CapitalizeFirstPipe,
		CharacterLimitPipe,
		JoinclassPipe,
		MinutesToHourminPipe,
		SanitizeModule,
		SeparatePascalCasePipe,
		StatusTextPipe,
		HtmlTextPipe,
		SuccessClassPipe,
		SvgInlinePipe,
		TextClassPipe,
		StripTagsPipe,
		SanitizeModule,
		DateFormatPipe,
		RemoveSpacePipe,
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
