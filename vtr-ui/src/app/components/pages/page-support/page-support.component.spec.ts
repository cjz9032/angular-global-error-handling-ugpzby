import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSupportComponent } from './page-support.component';

xdescribe('PageSupportComponent', () => {
	let component: PageSupportComponent;
	let fixture: ComponentFixture<PageSupportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageSupportComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageSupportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
