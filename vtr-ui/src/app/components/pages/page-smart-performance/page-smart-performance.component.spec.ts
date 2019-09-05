import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSmartPerformanceComponent } from './page-smart-performance.component';

xdescribe('PageSmartPerformanceComponent', () => {
	let component: PageSmartPerformanceComponent;
	let fixture: ComponentFixture<PageSmartPerformanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageSmartPerformanceComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageSmartPerformanceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
