import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEticketComponent } from './modal-eticket.component';

xdescribe('ModalEticketComponent', () => {
  let component: ModalEticketComponent;
  let fixture: ComponentFixture<ModalEticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
