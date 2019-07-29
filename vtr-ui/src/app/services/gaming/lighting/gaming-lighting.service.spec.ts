import { TestBed } from '@angular/core/testing';

import { GamingLightingService } from './gaming-lighting.service';

xdescribe('GamingLightingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingLightingService = TestBed.get(GamingLightingService);
    expect(service).toBeTruthy();
  });
});
