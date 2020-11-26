import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoupdateSettingsComponent } from './autoupdate-settings.component';

xdescribe('AutoupdateSettingsComponent', () => {
	let component: AutoupdateSettingsComponent;
	let fixture: ComponentFixture<AutoupdateSettingsComponent>;

	beforeEach(async(() => {
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
