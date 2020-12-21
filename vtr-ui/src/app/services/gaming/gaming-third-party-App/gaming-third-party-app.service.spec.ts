import { TestBed } from '@angular/core/testing';

import { GamingThirdPartyAppService } from './gaming-third-party-app.service';

describe('GamingThirdPartyAppService', () => {
  let service: GamingThirdPartyAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamingThirdPartyAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
