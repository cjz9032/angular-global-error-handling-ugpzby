import { TranslationSection } from 'src/app/enums/translation-section.enum';

export default class Translation {
	constructor(
		public type: TranslationSection,
		public payload: any
	) { }
}
