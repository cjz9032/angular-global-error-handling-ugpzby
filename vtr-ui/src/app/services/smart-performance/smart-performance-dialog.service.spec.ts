import { TestBed } from '@angular/core/testing';

import { SmartPerformanceDialogService } from './smart-performance-dialog.service';

describe('SmartPerformanceDialogService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: SmartPerformanceDialogService = TestBed.inject(SmartPerformanceDialogService);
		expect(service).toBeTruthy();
	});
});
