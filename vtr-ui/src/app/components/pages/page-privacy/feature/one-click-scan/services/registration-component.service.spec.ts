import { TestBed } from '@angular/core/testing';

import { RegistrationComponentService } from './registration-component.service';

describe('RegistrationComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationComponentService = TestBed.get(RegistrationComponentService);
    expect(service).toBeTruthy();
  });
});
