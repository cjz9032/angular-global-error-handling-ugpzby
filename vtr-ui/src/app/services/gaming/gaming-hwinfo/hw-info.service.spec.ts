import { TestBed } from '@angular/core/testing';

import { HwInfoService } from './hw-info.service';

xdescribe('HwInfoService', () => {
 beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HwInfoService = TestBed.get(HwInfoService);
    expect(service).toBeTruthy();
  });
});
