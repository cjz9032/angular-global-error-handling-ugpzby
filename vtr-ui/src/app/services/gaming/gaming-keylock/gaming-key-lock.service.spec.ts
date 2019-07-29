import { TestBed } from '@angular/core/testing';

import { GamingKeyLockService } from './gaming-key-lock.service';

xdescribe('GamingKeyLockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingKeyLockService = TestBed.get(GamingKeyLockService);
    expect(service).toBeTruthy();
  });
});
