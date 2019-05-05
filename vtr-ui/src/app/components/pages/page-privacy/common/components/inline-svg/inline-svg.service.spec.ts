import { TestBed } from '@angular/core/testing';

import { InlineSvgService } from './inline-svg.service';

describe('InlineSvgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InlineSvgService = TestBed.get(InlineSvgService);
    expect(service).toBeTruthy();
  });
});
