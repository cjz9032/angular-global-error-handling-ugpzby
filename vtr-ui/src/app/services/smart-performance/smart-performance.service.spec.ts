import { TestBed } from '@angular/core/testing';

import { SmartPerformanceService } from './smart-performance.service';

xdescribe('SmartPerformanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartPerformanceService = TestBed.get(SmartPerformanceService);
    expect(service).toBeTruthy();
  });
});