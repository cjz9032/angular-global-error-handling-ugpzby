import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDropdownHwscanComponent } from './ui-dropdown-hwscan.component';

xdescribe('UiDropdownHwscanComponent', () => {
	let component: UiDropdownHwscanComponent;
	let fixture: ComponentFixture<UiDropdownHwscanComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiDropdownHwscanComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDropdownHwscanComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
