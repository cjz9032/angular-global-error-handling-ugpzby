import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiTooltipsComponent } from './ui-tooltips.component';

describe('UiTooltipsComponent', () => {
	let component: UiTooltipsComponent;
	let fixture: ComponentFixture<UiTooltipsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiTooltipsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiTooltipsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
