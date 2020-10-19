import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetRecommendActionComponent } from './widget-recommend-action.component';

describe('WidgetRecommendActionComponent', () => {
	let component: WidgetRecommendActionComponent;
	let fixture: ComponentFixture<WidgetRecommendActionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [WidgetRecommendActionComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetRecommendActionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
