import { TestBed } from '@angular/core/testing';

import { ExportSnapshotResultsService } from './export-snapshot-results.service';

describe('ExportSnapshotResultsService', () => {
  let service: ExportSnapshotResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportSnapshotResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
