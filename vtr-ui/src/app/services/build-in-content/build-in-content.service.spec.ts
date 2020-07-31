import { async, TestBed } from "@angular/core/testing";

import { BuildInContentService } from './build-in-content.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('BuildInContentService', () => {
  let service: BuildInContentService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        HttpClient
      ]
    });
    service = TestBed.inject(BuildInContentService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
