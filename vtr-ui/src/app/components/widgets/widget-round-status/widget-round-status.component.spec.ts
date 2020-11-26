import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetRoundStatusComponent } from './widget-round-status.component';

describe('WidgetRoundStatusComponent', () => {
	let component: WidgetRoundStatusComponent;
	let fixture: ComponentFixture<WidgetRoundStatusComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [WidgetRoundStatusComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetRoundStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
