import { TestBed } from '@angular/core/testing';

import { SmartPrivacyMessengerService } from './smart-privacy-messenger.service';

describe('SmartPrivacyMessengerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: SmartPrivacyMessengerService = TestBed.inject(
			SmartPrivacyMessengerService
		);
		expect(service).toBeTruthy();
	});
});
