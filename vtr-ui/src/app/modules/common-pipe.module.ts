import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { CapitalizeFirstPipe } from '../pipe/capitalize-pipe/capitalize-first.pipe';
import { CharacterLimitPipe } from '../pipe/ui-chs-statusbar/character-limit.pipe';
import { DateClassPipe } from '../pipe/security-antivirus/date-class.pipe';
import { DaysIntervalPipe } from '../pipe/connected-home-security/account-status/days-interval.pipe';
import { IconClassPipe } from '../pipe/ui-security-statusbar/icon-class.pipe';
import { IconNamePipe } from '../pipe/ui-security-statusbar/icon-name.pipe';
import { JoinclassPipe } from '../pipe/security-wifi/join-class.pipe';
import { MinutesToHourminPipe } from '../pipe/minutes-to-hourmin.pipe';
import { PipeInstallPipe } from '../pipe/security-antivirus/pipe-install.pipe';
import { SanitizeModule } from './sanitize.module';
import { SeparatePascalCasePipe } from '../pipe/separate-pascal-case.pipe';
import { StatusTextPipe } from '../pipe/ui-security-statusbar/status-text.pipe';
import { StatusTransformPipe } from '../pipe/ui-security-statusbar/status-transform.pipe';
import { SubTransformPipe } from '../pipe/security-antivirus/sub-transform.pipe';
import { SuccessClassPipe } from '../pipe/security-wifi/success-class.pipe';
import { SvgInlinePipe } from '../pipe/svg-inline/svg-inline.pipe';
import { TextClassPipe } from '../pipe/ui-security-statusbar/text-class.pipe';
import { UniqueIdPipe } from '../pipe/unique-id.pipe';

@NgModule({
	declarations: [
		CapitalizeFirstPipe,
		CharacterLimitPipe,
		DateClassPipe,
		DaysIntervalPipe,
		IconClassPipe,
		IconNamePipe,
		JoinclassPipe,
		MinutesToHourminPipe,
		PipeInstallPipe,
		SeparatePascalCasePipe,
		StatusTextPipe,
		StatusTransformPipe,
		SubTransformPipe,
		SuccessClassPipe,
		SvgInlinePipe,
		TextClassPipe,
		UniqueIdPipe
	],
	exports: [
		CapitalizeFirstPipe,
		CharacterLimitPipe,
		DateClassPipe,
		DaysIntervalPipe,
		IconClassPipe,
		IconNamePipe,
		JoinclassPipe,
		MinutesToHourminPipe,
		PipeInstallPipe,
		SanitizeModule,
		SeparatePascalCasePipe,
		StatusTextPipe,
		StatusTransformPipe,
		SubTransformPipe,
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
