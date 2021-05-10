import { TestBed } from '@angular/core/testing';

import { SmartPrivacyListenService } from './smart-privacy-listen.service';

describe('SmartPrivacyListenService', () => {
  let service: SmartPrivacyListenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartPrivacyListenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
