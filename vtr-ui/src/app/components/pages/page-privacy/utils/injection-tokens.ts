import { InjectionToken } from '@angular/core';
import { getPrivacyEnvironment } from '../environment';

export const PRIVACY_BASE_URL = new InjectionToken('PrivacyBaseUrl', {
	providedIn: 'root',
	factory: () => 'privacy'
});

export const PRIVACY_ENVIRONMENT = new InjectionToken('PrivacyEnvironment', {
	providedIn: 'root',
	factory: () => getPrivacyEnvironment()
});
