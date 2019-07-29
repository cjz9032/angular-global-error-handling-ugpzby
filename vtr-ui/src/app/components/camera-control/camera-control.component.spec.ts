import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraControlComponent } from './camera-control.component';

xdescribe('CameraControlComponent', () => {
	let component: CameraControlComponent;
	let fixture: ComponentFixture<CameraControlComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CameraControlComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CameraControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
