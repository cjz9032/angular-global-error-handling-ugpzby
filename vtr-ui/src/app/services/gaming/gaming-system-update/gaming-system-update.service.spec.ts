import { TestBed } from '@angular/core/testing';

import { GamingSystemUpdateService } from './gaming-system-update.service';

xdescribe('GamingSystemUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingSystemUpdateService = TestBed.get(GamingSystemUpdateService);
    expect(service).toBeTruthy();
  });
});
