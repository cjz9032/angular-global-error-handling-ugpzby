import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHardwareListComponent } from './ui-hardware-list.component';

xdescribe('UiHardwareListComponent', () => {
	let component: UiHardwareListComponent;
	let fixture: ComponentFixture<UiHardwareListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiHardwareListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiHardwareListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
