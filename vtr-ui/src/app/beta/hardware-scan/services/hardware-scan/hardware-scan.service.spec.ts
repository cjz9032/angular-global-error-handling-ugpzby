import { TestBed } from '@angular/core/testing';

import { HardwareScanService } from './hardware-scan.service';

describe('HardwareScanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: HardwareScanService = TestBed.get(HardwareScanService);
	expect(service).toBeTruthy();
  });
});
