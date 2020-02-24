import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecoverConfirmComponent } from './modal-recover-confirm.component';

xdescribe('ModalWait', () => {
  let component: ModalRecoverConfirmComponent;
  let fixture: ComponentFixture<ModalRecoverConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRecoverConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRecoverConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
