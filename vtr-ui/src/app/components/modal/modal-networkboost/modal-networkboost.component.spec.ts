import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNetworkboostComponent } from './modal-networkboost.component';

describe('ModalNetworkboostComponent', () => {
  let component: ModalNetworkboostComponent;
  let fixture: ComponentFixture<ModalNetworkboostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNetworkboostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNetworkboostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
