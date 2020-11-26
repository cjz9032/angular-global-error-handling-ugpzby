import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiListChevronComponent } from './ui-list-chevron.component';

xdescribe('UiListChevronComponent', () => {
	let component: UiListChevronComponent;
	let fixture: ComponentFixture<UiListChevronComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiListChevronComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiListChevronComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
