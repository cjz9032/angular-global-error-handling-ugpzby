import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRebootConfirmComponent } from './modal-reboot-confirm.component';

describe('ModalRebootConfirmComponent', () => {
  let component: ModalRebootConfirmComponent;
  let fixture: ComponentFixture<ModalRebootConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRebootConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRebootConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
