import { TestBed, async, inject } from '@angular/core/testing';

import { IsOnlineGuard } from './is-online.guard';

describe('IsOnlineGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsOnlineGuard]
    });
  });

  it('should ...', inject([IsOnlineGuard], (guard: IsOnlineGuard) => {
    expect(guard).toBeTruthy();
  }));
});
