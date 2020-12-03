import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetCarouselComponent } from './widget-carousel.component';

xdescribe('WidgetCarouselComponent', () => {
	let component: WidgetCarouselComponent;
	let fixture: ComponentFixture<WidgetCarouselComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetCarouselComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetCarouselComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
