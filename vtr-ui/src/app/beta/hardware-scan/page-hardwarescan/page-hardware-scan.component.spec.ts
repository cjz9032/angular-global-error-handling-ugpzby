import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHardwareScanComponent } from './page-hardware-scan.component';

xdescribe('PageDeviceHardwareScanComponent', () => {
  let component: PageHardwareScanComponent;
  let fixture: ComponentFixture<PageHardwareScanComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ PageHardwareScanComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PageHardwareScanComponent);
 component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
