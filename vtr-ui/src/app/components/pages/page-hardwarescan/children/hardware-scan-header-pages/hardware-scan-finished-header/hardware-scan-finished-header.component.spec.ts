import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DevService } from '../../../../../../services/dev/dev.service';

import { HardwareScanFinishedHeaderComponent } from './hardware-scan-finished-header.component';

describe('HardwareScanFinishedHeaderComponent', () => {
	let component: HardwareScanFinishedHeaderComponent;
	let fixture: ComponentFixture<HardwareScanFinishedHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule, HttpClientModule, TranslateModule.forRoot() ],
			providers: [ DevService ],
			declarations: [ HardwareScanFinishedHeaderComponent ]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HardwareScanFinishedHeaderComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call setupFailedTests', () => {
		const spy = spyOn(component, 'setupFailedTests');
		component.setupFailedTests();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should call onScanAgain method', () => {
		const spy = spyOn(component, 'onScanAgain');
		component.onScanAgain();
		expect(spy).toHaveBeenCalled();
	});

	it('should call getFinalResultCode method', () => {
		const spy = spyOn(component, 'getFinalResultCode');
		component.getFinalResultCode();
		expect(spy).toHaveBeenCalled();
	});
});
