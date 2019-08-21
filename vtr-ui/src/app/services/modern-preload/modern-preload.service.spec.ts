import { TestBed } from '@angular/core/testing';

import { ModernPreloadService } from './modern-preload.service';

xdescribe('ModernPreloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModernPreloadService = TestBed.get(ModernPreloadService);
    expect(service).toBeTruthy();
  });
});
