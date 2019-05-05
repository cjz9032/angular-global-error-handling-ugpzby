import { TestBed, async, inject } from '@angular/core/testing';

import { ChoseBrowserGuard } from './chose-browser.guard';

describe('ChoseBrowserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChoseBrowserGuard]
    });
  });

  it('should ...', inject([ChoseBrowserGuard], (guard: ChoseBrowserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
