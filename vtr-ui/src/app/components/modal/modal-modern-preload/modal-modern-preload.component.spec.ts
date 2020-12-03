import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalModernPreloadComponent } from './modal-modern-preload.component';

xdescribe('ModalModernPreloadComponent', () => {
	let component: ModalModernPreloadComponent;
	let fixture: ComponentFixture<ModalModernPreloadComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalModernPreloadComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalModernPreloadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
