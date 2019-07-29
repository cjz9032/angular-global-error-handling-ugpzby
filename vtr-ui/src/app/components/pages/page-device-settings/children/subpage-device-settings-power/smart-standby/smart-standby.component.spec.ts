import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartStandbyComponent } from './smart-standby.component';

xdescribe('SmartStandbyComponent', () => {
	let component: SmartStandbyComponent;
	  let fixture: ComponentFixture<SmartStandbyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SmartStandbyComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SmartStandbyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
