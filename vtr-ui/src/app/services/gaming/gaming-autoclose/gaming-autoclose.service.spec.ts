import { TestBed } from '@angular/core/testing';

import { GamingAutocloseService } from './gaming-autoclose.service';

describe('GamingAutocloseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingAutocloseService = TestBed.get(GamingAutocloseService);
    expect(service).toBeTruthy();
  });
});
