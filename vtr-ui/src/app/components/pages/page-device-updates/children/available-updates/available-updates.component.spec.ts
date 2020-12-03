import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvailableUpdatesComponent } from './available-updates.component';

xdescribe('AvailableUpdatesComponent', () => {
	let component: AvailableUpdatesComponent;
	let fixture: ComponentFixture<AvailableUpdatesComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AvailableUpdatesComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AvailableUpdatesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
