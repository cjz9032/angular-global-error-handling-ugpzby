import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTestResultIconComponent } from './ui-test-result-icon.component';
// import 'jasmine';

describe('UiTestResultIconComponent', () => {
	let component: UiTestResultIconComponent;
	let fixture: ComponentFixture<UiTestResultIconComponent>;

	beforeEach(async(() => {
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
