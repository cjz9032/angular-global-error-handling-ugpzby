import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetOfflineInfoComponent } from './widget-offline-info.component';

xdescribe('WidgetOfflineInfoComponent', () => {
	let component: WidgetOfflineInfoComponent;
	let fixture: ComponentFixture<WidgetOfflineInfoComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetOfflineInfoComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetOfflineInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
