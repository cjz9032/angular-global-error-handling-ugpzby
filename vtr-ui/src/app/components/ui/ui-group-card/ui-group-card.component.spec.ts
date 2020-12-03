import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiGroupCardComponent } from './ui-group-card.component';

describe('UiGroupCardComponent', () => {
	let component: UiGroupCardComponent;
	let fixture: ComponentFixture<UiGroupCardComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiGroupCardComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiGroupCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
