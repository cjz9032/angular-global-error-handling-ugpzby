import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMeetingExpirienceComponent } from './page-meeting-expirience.component';

describe('PageMeetingExpirienceComponent', () => {
  let component: PageMeetingExpirienceComponent;
  let fixture: ComponentFixture<PageMeetingExpirienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageMeetingExpirienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMeetingExpirienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
