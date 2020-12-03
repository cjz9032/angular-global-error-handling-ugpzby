import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiHyperlinkButtonComponent } from './ui-hyperlink-button.component';

describe('UiHyperlinkButtonComponent', () => {
	let component: UiHyperlinkButtonComponent;
	let fixture: ComponentFixture<UiHyperlinkButtonComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiHyperlinkButtonComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiHyperlinkButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
