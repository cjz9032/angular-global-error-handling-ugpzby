import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDotAnimateComponent } from './ui-dot-animate.component';

describe('UiDotAnimateComponent', () => {
	let component: UiDotAnimateComponent;
	let fixture: ComponentFixture<UiDotAnimateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiDotAnimateComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDotAnimateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
