import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageMeetingManagerComponent } from './subpage-meeting-manager.component';

describe('SubpageMeetingManagerComponent', () => {
  let component: SubpageMeetingManagerComponent;
  let fixture: ComponentFixture<SubpageMeetingManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubpageMeetingManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpageMeetingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
