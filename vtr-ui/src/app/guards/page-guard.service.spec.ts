import { TestBed } from '@angular/core/testing';

import { PageGuardService } from './page-guard.service';

describe('PageGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageGuardService = TestBed.get(PageGuardService);
    expect(service).toBeTruthy();
  });
});
