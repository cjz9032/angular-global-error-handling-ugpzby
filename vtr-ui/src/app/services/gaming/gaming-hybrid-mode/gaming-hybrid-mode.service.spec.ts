import { TestBed } from '@angular/core/testing';

import { GamingHybridModeService } from './gaming-hybrid-mode.service';

xdescribe('GamingHybridModeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingHybridModeService = TestBed.get(GamingHybridModeService);
    expect(service).toBeTruthy();
  });
});
