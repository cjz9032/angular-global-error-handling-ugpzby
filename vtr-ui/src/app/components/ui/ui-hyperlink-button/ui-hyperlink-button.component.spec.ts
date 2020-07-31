import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHyperlinkButtonComponent } from './ui-hyperlink-button.component';

describe('UiHyperlinkButtonComponent', () => {
	let component: UiHyperlinkButtonComponent;
	let fixture: ComponentFixture<UiHyperlinkButtonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ UiHyperlinkButtonComponent ]
		})
			.compileComponents();
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
