import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGamingLightingComponent } from './modal-gaming-lighting.component';

describe('ModalGamingLightingComponent', () => {
  let component: ModalGamingLightingComponent;
  let fixture: ComponentFixture<ModalGamingLightingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGamingLightingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGamingLightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
