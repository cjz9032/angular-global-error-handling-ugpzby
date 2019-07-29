import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutocloseComponent } from './modal-autoclose.component';

describe('ModalAutocloseComponent', () => {
  let component: ModalAutocloseComponent;
  let fixture: ComponentFixture<ModalAutocloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAutocloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAutocloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
