import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFailedModalComponent } from './download-failed-modal.component';

describe('DownloadFailedModalComponent', () => {
  let component: DownloadFailedModalComponent;
  let fixture: ComponentFixture<DownloadFailedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadFailedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFailedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
