import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageSupportDetailComponent } from './page-support-detail.component';

xdescribe('PageSupportComponent', () => {
	let component: PageSupportDetailComponent;
	let fixture: ComponentFixture<PageSupportDetailComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageSupportDetailComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageSupportDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
