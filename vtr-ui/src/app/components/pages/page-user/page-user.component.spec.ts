import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageUserComponent } from './page-user.component';

xdescribe('PageUserComponent', () => {
	let component: PageUserComponent;
	let fixture: ComponentFixture<PageUserComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageUserComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
