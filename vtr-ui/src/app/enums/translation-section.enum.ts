/**
 * this enum is for getting updates when app language is changes.
 * html can handle it gracefully but string in ts file requires special attention.
 */
export enum TranslationSection {
	Unknown = 'unknown',
	CommonMenu = 'common.menu',
	CommonUi = 'common.ui'
}
