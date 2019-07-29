import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';

xdescribe('AudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioService = TestBed.get(AudioService);
    expect(service).toBeTruthy();
  });
});
