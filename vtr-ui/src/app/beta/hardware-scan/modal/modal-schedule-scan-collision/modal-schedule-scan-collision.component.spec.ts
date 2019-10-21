import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScheduleScanCollisionComponent } from './modal-schedule-scan-collision.component';

xdescribe('ModalScheduleScanCollisionComponent', () => {
  let component: ModalScheduleScanCollisionComponent;
  let fixture: ComponentFixture<ModalScheduleScanCollisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalScheduleScanCollisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalScheduleScanCollisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
