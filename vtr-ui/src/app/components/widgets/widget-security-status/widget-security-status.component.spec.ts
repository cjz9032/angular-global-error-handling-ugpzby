import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSecurityStatusComponent } from './widget-security-status.component';

xdescribe('WidgetSecurityStatusComponent', () => {
	let component: WidgetSecurityStatusComponent;
	let fixture: ComponentFixture<WidgetSecurityStatusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetSecurityStatusComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetSecurityStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
