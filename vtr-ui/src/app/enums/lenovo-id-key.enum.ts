/**
 * this enum is for local storage keys. new keys can be added here. please give meaningful names to key.
 */
export enum LenovoIdKey {
	FirstName = '[LenovoIdKey] FirstName'
}

export enum LenovoIdStatus {
	Unknown = '[LenovoIdStatus] Unknown',
	StarterId = '[LenovoIdStatus] StarterId',
	SignedIn = '[LenovoIdStatus] SignedIn',
	SignedOut = '[LenovoIdStatus] SignedOut',
	Disabled = '[LenovoIdStatus] SignedOut',
	Pending = '[LenovoIdStatus] SignedOut'
}