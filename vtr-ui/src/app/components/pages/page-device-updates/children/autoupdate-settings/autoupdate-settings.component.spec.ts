import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AutoupdateSettingsComponent } from './autoupdate-settings.component';

xdescribe('AutoupdateSettingsComponent', () => {
	let component: AutoupdateSettingsComponent;
	let fixture: ComponentFixture<AutoupdateSettingsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AutoupdateSettingsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutoupdateSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
