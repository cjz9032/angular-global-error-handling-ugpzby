import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageAppsForYouComponent } from './page-apps-for-you.component';

xdescribe('PageAppsForYouComponent', () => {
	let component: PageAppsForYouComponent;
	let fixture: ComponentFixture<PageAppsForYouComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageAppsForYouComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageAppsForYouComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
