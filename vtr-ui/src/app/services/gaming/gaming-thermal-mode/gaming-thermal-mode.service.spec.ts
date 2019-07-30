import { TestBed } from '@angular/core/testing';

import { GamingThermalModeService } from './gaming-thermal-mode.service';

xdescribe('GamingThermalModeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingThermalModeService = TestBed.get(GamingThermalModeService);
    expect(service).toBeTruthy();
  });
});
