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
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { HtmlTextPipe } from 'src/app/pipe/html-text/html-text.pipe';
import { FormatLocaleDateTimePipe } from 'src/app/pipe/format-locale-datetime/format-locale-datetime.pipe';
import { TranslateDefaultValueIfNotFoundPipe } from 'src/app/pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { TranslateTokenByTokenPipe } from 'src/app/pipe/translate-token-by-token/translate-token-by-token.pipe';

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
		FormatLocaleDatePipe,
		RemoveSpacePipe,
		FormatLocaleDateTimePipe,
		TranslateDefaultValueIfNotFoundPipe,
		TranslateTokenByTokenPipe
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
		FormatLocaleDatePipe,
		RemoveSpacePipe,
		FormatLocaleDateTimePipe,
		TranslateDefaultValueIfNotFoundPipe,
		TranslateTokenByTokenPipe
	],
	imports: [
		SanitizeModule,
	],
	providers: [
		FormatLocaleDatePipe,
		FormatLocaleDateTimePipe,
		TranslateTokenByTokenPipe
	],
	entryComponents: [
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class CommonPipeModule { }
