import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiGroupCardComponent } from './ui-group-card.component';

describe('UiGroupCardComponent', () => {
	let component: UiGroupCardComponent;
	let fixture: ComponentFixture<UiGroupCardComponent>;

	beforeEach(async(() => {
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
