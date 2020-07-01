import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiRowSwitchComponent } from './ui-row-switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceService } from 'src/app/services/device/device.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { EventEmitter } from 'protractor';

const on = {
	value: true,
};
const off = {
	value: true,
};

describe('UiRowSwitchComponent', () => {
	let component: UiRowSwitchComponent;
	let fixture: ComponentFixture<UiRowSwitchComponent>;
	let deviceService: DeviceService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiRowSwitchComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [NgbModal, DevService, DeviceService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRowSwitchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should test on onOnOffChange method', () => {
		spyOn(component.toggleOnOff, 'emit').and.callThrough();
		component.onOnOffChange(off.value);
		expect(component.toggleOnOff.emit).toHaveBeenCalled();
	});

	/* it('should test on rebootConfirm method', () => {
		spyOn(component.toggleOnOff, 'emit').and.callThrough();
		spyOn(component.rebootConfirm,new EventEmitter() );
		component.onOnOffChange(off.value);
		fixture.detectChanges();
		expect(component.toggleOnOff.emit).toHaveBeenCalled();
		expect(component.rebootConfirm).toHaveBeenCalled();
	}); */
});
