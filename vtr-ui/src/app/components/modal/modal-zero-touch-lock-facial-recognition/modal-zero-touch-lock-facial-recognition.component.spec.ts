import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalZeroTouchLockFacialRecognitionComponent } from './modal-zero-touch-lock-facial-recognition.component';

describe('ModalZeroTouchLockFacialRecognitionComponent', () => {
  let component: ModalZeroTouchLockFacialRecognitionComponent;
  let fixture: ComponentFixture<ModalZeroTouchLockFacialRecognitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalZeroTouchLockFacialRecognitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalZeroTouchLockFacialRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
