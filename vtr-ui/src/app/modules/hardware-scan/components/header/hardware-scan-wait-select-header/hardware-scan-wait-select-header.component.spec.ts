import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HardwareScanWaitSelectHeaderComponent } from './hardware-scan-wait-select-header.component';

describe('HardwareScanWaitSelectHeaderComponent', () => {
	let component: HardwareScanWaitSelectHeaderComponent;
	let fixture: ComponentFixture<HardwareScanWaitSelectHeaderComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [HardwareScanWaitSelectHeaderComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HardwareScanWaitSelectHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	//   it('should create', () => {
	//     expect(component).toBeTruthy();
	//   });

	//   it('button should be enabled', () => {
	//     expect(this.isButtonDisable()).toEqual(false);
	//   });

	//   it('should have Quick Scan in "Quick Scan button"', () => {
	//     const fixture = TestBed.createComponent(HardwareScanWaitSelectHeaderComponent);
	//     const btn = fixture.debugElement.nativeElement.querySelector('.action-button');
	//     expect(btn.innerHTML).toBe('Quick Scan');
	//   });

	//   it('should have Customize in "Customize link"', () => {
	//     const fixture = TestBed.createComponent(HardwareScanWaitSelectHeaderComponent);
	//     const btn = fixture.debugElement.nativeElement.querySelector('.action-anchor');
	//     expect(btn.innerHTML).toBe('Customize');
	//   });
});
