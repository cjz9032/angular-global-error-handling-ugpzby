import { TestBed } from '@angular/core/testing';

import { TimerServiceEx } from './timer-service-ex.service';

describe('TimerServiceExService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimerServiceEx = TestBed.get(TimerServiceEx);
    expect(service).toBeTruthy();
  });
});
