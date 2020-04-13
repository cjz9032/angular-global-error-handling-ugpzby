import { TestBed } from '@angular/core/testing';

import { GamingAccessoryService } from './gaming-accessory.service';

describe('GamingAccessoryService', () => {
  let service: GamingAccessoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamingAccessoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
