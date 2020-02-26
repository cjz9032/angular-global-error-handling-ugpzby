import { TestBed } from '@angular/core/testing';

import { PowerDpmService } from './power-dpm.service';

describe('PowerDpmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PowerDpmService = TestBed.get(PowerDpmService);
    expect(service).toBeTruthy();
  });
});
