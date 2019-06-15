import { TestBed } from '@angular/core/testing';

import { AndroidService } from './android.service';

describe('AndroidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AndroidService = TestBed.get(AndroidService);
    expect(service).toBeTruthy();
  });
});
