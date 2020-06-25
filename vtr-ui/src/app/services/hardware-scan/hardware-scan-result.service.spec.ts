import { TestBed } from '@angular/core/testing';

import { HardwareScanResultService } from './hardware-scan-result.service';

describe('HardwareScanUtilsService', () => {
  let service: HardwareScanResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HardwareScanResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
