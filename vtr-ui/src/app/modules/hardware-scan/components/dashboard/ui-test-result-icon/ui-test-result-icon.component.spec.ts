import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiTestResultIconComponent } from './ui-test-result-icon.component';
// import 'jasmine';

describe('UiTestResultIconComponent', () => {
	let component: UiTestResultIconComponent;
	let fixture: ComponentFixture<UiTestResultIconComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiTestResultIconComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiTestResultIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
