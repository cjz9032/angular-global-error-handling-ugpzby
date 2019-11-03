import {
	MissingTranslationHandlerParams,
	MissingTranslationHandler
} from '@ngx-translate/core';

export class MissingTranslationDefaultHandler
	implements MissingTranslationHandler {
	handle(params: MissingTranslationHandlerParams): string {
		return '';
	}
}
