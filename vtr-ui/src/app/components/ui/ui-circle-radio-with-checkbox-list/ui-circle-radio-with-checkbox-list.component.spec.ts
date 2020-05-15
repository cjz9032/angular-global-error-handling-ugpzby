import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCircleRadioWithCheckBoxListComponent } from './ui-circle-radio-with-checkbox-list.component';

xdescribe('UiCircleRadioWithCheckBoxListComponent', () => {
  let component: UiCircleRadioWithCheckBoxListComponent;
  let fixture: ComponentFixture<UiCircleRadioWithCheckBoxListComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ UiCircleRadioWithCheckBoxListComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(UiCircleRadioWithCheckBoxListComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
});
