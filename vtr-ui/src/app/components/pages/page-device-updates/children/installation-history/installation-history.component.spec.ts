import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationHistoryComponent } from './installation-history.component';

describe('InstallationHistoryComponent', () => {
	let component: InstallationHistoryComponent;
	let fixture: ComponentFixture<InstallationHistoryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [InstallationHistoryComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InstallationHistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
