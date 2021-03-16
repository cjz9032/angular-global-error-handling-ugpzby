import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBoostContainerComponent } from './widget-boost-container.component';

describe('WidgetIntelligentBoostComponent', () => {
	let component: WidgetBoostContainerComponent;
	let fixture: ComponentFixture<WidgetBoostContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [WidgetBoostContainerComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetBoostContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
