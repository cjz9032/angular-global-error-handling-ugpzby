import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsPageLayoutComponent } from './settings-page-layout.component';

xdescribe('SettingsPageLayoutComponent', () => {
	let component: SettingsPageLayoutComponent;
	let fixture: ComponentFixture<SettingsPageLayoutComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SettingsPageLayoutComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SettingsPageLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
