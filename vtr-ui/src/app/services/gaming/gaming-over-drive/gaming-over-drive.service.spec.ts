import { TestBed } from '@angular/core/testing';

import { GamingOverDriveService } from './gaming-over-drive.service';

describe('GamingOverDriveService', () => {
  let service: GamingOverDriveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamingOverDriveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
