import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetMcafeeComponent } from './widget-mcafee.component';

xdescribe('WidgetMcafeeComponent', () => {
	let component: WidgetMcafeeComponent;
	let fixture: ComponentFixture<WidgetMcafeeComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetMcafeeComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetMcafeeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
