import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTurnOnComponent } from './modal-turn-on.component';

xdescribe('ModalTurnOnComponent', () => {
  let component: ModalTurnOnComponent;
  let fixture: ComponentFixture<ModalTurnOnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTurnOnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTurnOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
