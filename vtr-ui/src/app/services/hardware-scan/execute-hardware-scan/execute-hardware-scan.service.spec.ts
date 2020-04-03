import { TestBed } from '@angular/core/testing';

import { ExecuteHardwareScanService } from './execute-hardware-scan.service';

describe('ExecuteHardwareScanService', () => {
  let service: ExecuteHardwareScanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecuteHardwareScanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
