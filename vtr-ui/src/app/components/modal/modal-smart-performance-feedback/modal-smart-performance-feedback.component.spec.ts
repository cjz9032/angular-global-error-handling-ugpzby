import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSmartPerformanceFeedbackComponent } from './modal-smart-performance-feedback.component';

describe('ModalSmartPerformanceFeedbackComponent', () => {
  let component: ModalSmartPerformanceFeedbackComponent;
  let fixture: ComponentFixture<ModalSmartPerformanceFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSmartPerformanceFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSmartPerformanceFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
