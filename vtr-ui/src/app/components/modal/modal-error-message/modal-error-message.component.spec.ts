import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalErrorMessageComponent } from './modal-error-message.component';

describe('ModalErrorMessageComponent', () => {
  let component: ModalErrorMessageComponent;
  let fixture: ComponentFixture<ModalErrorMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalErrorMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
