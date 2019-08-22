import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDatabase } from '@fortawesome/pro-light-svg-icons/faDatabase';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { faBrowser } from '@fortawesome/pro-light-svg-icons/faBrowser';
import { faTools } from '@fortawesome/pro-light-svg-icons/faTools';
import { faKey } from '@fortawesome/pro-light-svg-icons/faKey';
import { faDebug } from '@fortawesome/pro-light-svg-icons/faDebug';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { faLockOpenAlt } from '@fortawesome/pro-light-svg-icons/faLockOpenAlt';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons/faEnvelope';
import { faCircleNotch } from '@fortawesome/pro-light-svg-icons/faCircleNotch';

library.add(
	faDatabase,
	faQuestionCircle,
	faBrowser,
	faTools,
	faKey,
	faDebug,
	faExclamationCircle,
	faLockOpenAlt,
	faTrash,
	faEnvelope,
	faCircleNotch
);

@NgModule({
	declarations: [],
	imports: [
		FontAwesomeModule,
		CommonModule
	],
	exports: [
		FontAwesomeModule
	]
})
export class CustomFontAwesomeModule {
}
