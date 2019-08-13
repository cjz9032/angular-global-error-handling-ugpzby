import { TestBed } from '@angular/core/testing';

import { HypothesisService } from './hypothesis.service';

describe('HypothesisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HypothesisService = TestBed.get(HypothesisService);
    expect(service).toBeTruthy();
  });
});
