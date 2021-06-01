import { TestBed } from '@angular/core/testing';

import { LenovoSericeBridgeService } from './lenovo-serice-bridge.service';

describe('LenovoSericeBridgeService', () => {
  let service: LenovoSericeBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LenovoSericeBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
