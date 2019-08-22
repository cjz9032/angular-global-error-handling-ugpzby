import { TestBed } from '@angular/core/testing';

import { LocalInfoService } from './local-info.service';

xdescribe('LocalInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalInfoService = TestBed.get(LocalInfoService);
    expect(service).toBeTruthy();
  });
});
