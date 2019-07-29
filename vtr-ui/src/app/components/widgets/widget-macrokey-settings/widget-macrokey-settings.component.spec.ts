import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMacrokeySettingsComponent } from './widget-macrokey-settings.component';

xdescribe('WidgetMacrokeySettingsComponent', () => {
	let component: WidgetMacrokeySettingsComponent;
	let fixture: ComponentFixture<WidgetMacrokeySettingsComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetMacrokeySettingsComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetMacrokeySettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
