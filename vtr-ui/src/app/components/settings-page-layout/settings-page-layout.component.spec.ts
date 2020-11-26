import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPageLayoutComponent } from './settings-page-layout.component';

xdescribe('SettingsPageLayoutComponent', () => {
	let component: SettingsPageLayoutComponent;
	let fixture: ComponentFixture<SettingsPageLayoutComponent>;

	beforeEach(async(() => {
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
