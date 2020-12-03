import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiDeviceinfoItemComponent } from './ui-deviceinfo-item.component';

describe('UiDeviceinfoItemComponent', () => {
	let component: UiDeviceinfoItemComponent;
	let fixture: ComponentFixture<UiDeviceinfoItemComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiDeviceinfoItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDeviceinfoItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
