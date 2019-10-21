import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHardwareScanCustomizeComponent } from './modal-hardware-scan-customize.component';

xdescribe('ModalHardwareScanCustomizeComponent', () => {
  let component: ModalHardwareScanCustomizeComponent;
  let fixture: ComponentFixture<ModalHardwareScanCustomizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHardwareScanCustomizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHardwareScanCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
