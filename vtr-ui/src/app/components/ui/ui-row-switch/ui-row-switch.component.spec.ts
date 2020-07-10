import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { UiRowSwitchComponent } from './ui-row-switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceService } from 'src/app/services/device/device.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { EventEmitter } from 'protractor';
import { ModalRebootConfirmComponent } from '../../modal/modal-reboot-confirm/modal-reboot-confirm.component';
import { ModalVoiceComponent } from '../../modal/modal-voice/modal-voice.component';
import { By } from '@angular/platform-browser';

const on = {
	value: true,
};
const off = {
	value: true,
};

const switchId = 'test';

fdescribe('UiRowSwitchComponent', () => {
	let component: UiRowSwitchComponent;
	let fixture: ComponentFixture<UiRowSwitchComponent>;
	let modalService: NgbModal;
	let deviceService: DeviceService;
	let translate: TranslateService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiRowSwitchComponent, ModalRebootConfirmComponent, ModalVoiceComponent, NgbTooltip],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,

			],
			providers: [NgbModal, DevService, DeviceService, TranslateService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRowSwitchComponent);
		component = fixture.componentInstance;
		component.switchId = switchId;
		modalService = fixture.debugElement.injector.get(NgbModal);
		deviceService = fixture.debugElement.injector.get(DeviceService);
		translate = fixture.debugElement.injector.get(TranslateService);

	});


	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should test on onResetClick method', () => {
		// const component = fixture.componentInstance;
		fixture.detectChanges();
		spyOn(component.resetClick, 'emit').and.callThrough();
		component.onResetClick(new Event('click'));
		expect(component.resetClick.emit).toHaveBeenCalled();
	});

	it('should test on onLinkClick method', () => {
		// let component = fixture.componentInstance;
		component.title = 'test';
		component.isSwitchVisible = false;
		component.linkText = 'test';
		component.linkPath = 'ms-settings:about';
		const elemID = switchId + '_click_link';
		fixture.detectChanges();
		spyOn(component, 'onLinkClick');

		// const button = fixture.debugElement.nativeElement.querySelector('#' + elemID);
		const button = fixture.debugElement.query(By.css('#' + elemID));
		button.nativeElement.click()
		fixture.detectChanges();
		/* fixture.whenStable().then(() => {
			expect(component.onLinkClick).toHaveBeenCalled();
		}); */
		// tick();
		expect(component.onLinkClick).toHaveBeenCalled();

	});

	it('should test on onRightIconClick method', () => {
		// component = fixture.componentInstance;
		// component.isSwitchVisible = false;
		// component.linkText = 'test';
		// component.linkPath = 'ms-settings:about';

		const elemID = switchId + '-tooltip_right_icon';
		component.tooltipText = 'Test';
		component.rightIcon = '[\'far\', \'question-circle\']';
		fixture.detectChanges();

		spyOn(component, 'onRightIconClick');
		// spyOn(component.tooltipClick, 'emit').and.callThrough();

		const button = fixture.debugElement.nativeElement.querySelector('#' + elemID);

		button.click();
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			expect(component.onRightIconClick).toHaveBeenCalled();
		});
		expect(component.onRightIconClick).toHaveBeenCalled();
		// expect(component.tooltipClick.emit).toHaveBeenCalled();

	});





	it('should test on onOnOffChange method', () => {
		// component = fixture.componentInstance;
		fixture.detectChanges();
		spyOn(component.toggleOnOff, 'emit').and.callThrough();
		component.onOnOffChange(off.value);
		expect(component.toggleOnOff.emit).toHaveBeenCalled();
	});

	it('should test on onReadMoreClick method', () => {
		fixture.detectChanges();
		spyOn(component.readMoreClick, 'emit').and.callThrough();
		component.onReadMoreClick(new Event('click'));
		expect(component.readMoreClick.emit).toHaveBeenCalled();
	});


	/* it('should test on rebootConfirm method', () => {
		spyOn(component.toggleOnOff, 'emit').and.callThrough();
		spyOn(component.rebootConfirm,new EventEmitter() );
		component.onOnOffChange(off.value);
		fixture.detectChanges();
		expect(component.toggleOnOff.emit).toHaveBeenCalled();
		expect(component.rebootConfirm).toHaveBeenCalled();
	}); */

	/* it('should test on rebootConfirm method with isRebootRequired false', () => {
		const component = fixture.componentInstance;
		let prevValue = component.isRebootRequired;
		component.title = 'test';
		component.isRebootRequired = false;
		spyOn(component, 'rebootConfirm');
		component.onOnOffChange(off.value);
		expect(component.rebootConfirm).toHaveBeenCalled();

	}); */

	it('should test on rebootConfirm method with isRebootRequired true', () => {
		// component = fixture.componentInstance;
		// const modalService = TestBed.get(NgbModal);
		component.title = 'Reversing the default primary function';
		// component.isSwitchChecked = false;
		const prevValue = component.isRebootRequired;
		component.isRebootRequired = true;
		fixture.detectChanges();

		spyOn(component, 'rebootConfirm');
		component.onOnOffChange(on.value);
		expect(component.rebootConfirm).toHaveBeenCalled();

	});

	/* it('should test on ngAfterViewInit modern-standby-link modern-standby', () => {
		const component = fixture.componentInstance;
		// const modalService = TestBed.get(NgbModal);
		component.title = 'Reversing the default primary function';
		component.caption='Test <a href=\'www.test.com\'>Test</a>';
		// component.isSwitchChecked = false;
		let prevValue = component.isRebootRequired;
		component.isRebootRequired = true;


		spyOn(component, 'rebootConfirm');
		component.onOnOffChange(on.value);
		expect(component.rebootConfirm).toHaveBeenCalled();

	}); */


	/* it('should test on ngAfterViewInit modern-standby-link modern-standby', () => {
		// component = fixture.componentInstance;
		// const modalService = TestBed.get(NgbModal);
		component.title = 'Reversing the default primary function';
		component.caption = 'Test <a href=\'www.test.com\'>Test</a>';
		component.readMoreText = 'test';

		// 'read_more_' + switchId


	}); */

});
