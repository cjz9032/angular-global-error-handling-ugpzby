import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDashboardAndroidComponent } from './page-dashboard-android.component';

describe('PageDashboardAndroidComponent', () => {
	let component: PageDashboardAndroidComponent;
	let fixture: ComponentFixture<PageDashboardAndroidComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageDashboardAndroidComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDashboardAndroidComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
