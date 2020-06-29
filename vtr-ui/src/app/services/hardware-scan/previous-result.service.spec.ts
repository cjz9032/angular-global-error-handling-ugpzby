import { TestBed } from '@angular/core/testing';

import { PreviousResultService } from './previous-result.service';

describe('PreviousResultService', () => {
  let service: PreviousResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
