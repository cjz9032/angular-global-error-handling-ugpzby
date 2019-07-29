import { TestBed } from '@angular/core/testing';

import { CameraDetailService } from './camera-detail.service';

xdescribe('CameraService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: CameraDetailService = TestBed.get(CameraDetailService);
		expect(service).toBeTruthy();
	});
});
