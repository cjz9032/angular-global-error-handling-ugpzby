import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareViewResultsComponent } from './hardware-view-results.component';

xdescribe('HardwareViewResultsComponent', () => {
  let component: HardwareViewResultsComponent;
  let fixture: ComponentFixture<HardwareViewResultsComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ HardwareViewResultsComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(HardwareViewResultsComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
