import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDescriptionButtonComponent } from './ui-description-button.component';

describe('UiDescriptionButtonComponent', () => {
	let component: UiDescriptionButtonComponent;
	let fixture: ComponentFixture<UiDescriptionButtonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiDescriptionButtonComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDescriptionButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
