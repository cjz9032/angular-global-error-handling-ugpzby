import { TestBed } from '@angular/core/testing';

import { CommonPopupService } from './common-popup.service';

describe('ComonPopupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonPopupService = TestBed.get(CommonPopupService);
    expect(service).toBeTruthy();
  });
});
