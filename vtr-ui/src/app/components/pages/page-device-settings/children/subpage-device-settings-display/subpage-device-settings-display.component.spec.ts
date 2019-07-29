import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubpageDeviceSettingsDisplayComponent } from './subpage-device-settings-display.component';
import { Pipe } from '@angular/core';
import { DisplayService } from 'src/app/services/display/display.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonService } from 'src/app/services/common/common.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
// const displayServiceMock = jasmine.createSpyObj('DisplayService', ['isShellAvailable', 'getPrivacyGuardCapability',
// 	'getPrivacyGuardOnPasswordCapability', 'getPrivacyGuardStatus', 'getPrivacyGuardOnPasswordStatus', 'setPrivacyGuardStatus', 'setPrivacyGuardOnPasswordStatus']);
// const commonServiceMock = jasmine.createSpyObj('CommonService', ['isShellAvailable', 'notification']);
// const baseCameraDetailServiceMock = jasmine.createSpyObj('BaseCameraDetail', ['isShellAvailable', 'cameraDetailObservable']);


describe('SubpageDeviceSettingsDisplayComponent', () => {
	// let component: SubpageDeviceSettingsDisplayComponent;
	// let fixture: ComponentFixture<SubpageDeviceSettingsDisplayComponent>;
	// displayServiceMock.isShellAvailable.and.returnValue(true);

	beforeEach(async(() => {
		// TestBed.configureTestingModule({
		// 	imports: [RouterTestingModule],
		// 	declarations: [SubpageDeviceSettingsDisplayComponent,
		// 		mockPipe({ name: 'translate' })],
		// 	schemas: [NO_ERRORS_SCHEMA],
		// 	providers: [{ provide: HttpClient }, { provide: DisplayService, useValue: displayServiceMock },

		// 	]
		// }).compileComponents();
		// fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		// displayServiceMock.getPrivacyGuardCapability.and.returnValue(Promise.resolve(true));
		// displayServiceMock.getPrivacyGuardOnPasswordCapability.and.returnValue(Promise.resolve(true));
		// displayServiceMock.getPrivacyGuardOnPasswordStatus.and.returnValue(Promise.resolve(true));
		// displayServiceMock.setPrivacyGuardStatus.and.returnValue(Promise.resolve(true));
		// displayServiceMock.setPrivacyGuardOnPasswordStatus.and.returnValue(Promise.resolve(true));
		// displayServiceMock.getPrivacyGuardStatus.and.returnValue(Promise.resolve(true));
		// displayServiceMock.startEyeCareMonitor.and.returnValue(Promise.resolve(true));
		// displayServiceMock.initEyecaremodeSettings.and.returnValue(Promise.resolve(true));

		// component = fixture.componentInstance;
		// fixture.detectChanges();
	}));

	// it('should create', () => {
	// 	expect(component).toBeTruthy();
	// });

	// it('should get the privacy guard capability status is true', fakeAsync(() => {
	// 	fixture.detectChanges();
	// 	component.getPrivacyGuardCapabilityStatus();
	// 	tick(10);
	// 	const result = component.privacyGuardCapability;
	// 	expect(result).toBe(true);

	// }));

	// it('should get the privacy guard capability status is false', fakeAsync(() => {
	// 	displayServiceMock.getPrivacyGuardCapability.and.returnValue(Promise.resolve(false));
	// 	fixture.detectChanges();
	// 	component.getPrivacyGuardCapabilityStatus();
	// 	tick(10);
	// 	const result = component.privacyGuardCapability;
	// 	expect(result).toBe(false);

	// }));


	// it('should get the privacy guard on password capability status is true', fakeAsync(() => {
	// 	fixture.detectChanges();
	// 	component.getPrivacyGuardOnPasswordCapabilityStatus();
	// 	tick(10);
	// 	const result = component.privacyGuardOnPasswordCapability;
	// 	expect(result).toBe(true);

	// }));

	// it('should get the privacy guard on password capability status is false', fakeAsync(() => {
	// 	displayServiceMock.getPrivacyGuardOnPasswordCapability.and.returnValue(Promise.resolve(false));
	// 	fixture.detectChanges();
	// 	component.getPrivacyGuardOnPasswordCapabilityStatus();
	// 	tick(10);
	// 	const result = component.privacyGuardOnPasswordCapability;
	// 	expect(result).toBe(false);
	// }));


	// it('should get the privacy guard toggle status is true', fakeAsync((done) => {
	// 	component.getPrivacyToggleStatusVal();
	// 	fixture.detectChanges();
	// 	tick(10);
	// 	const result = component.privacyGuardToggleStatus;
	// 	clearInterval(component.privacyGuardInterval);
	// 	tick(10);

	// 	expect(result).toBe(true);
	// 	done();
	// }));

	// it('should get the privacy guard toggle status is false', fakeAsync((done) => {
	// 	displayServiceMock.getPrivacyGuardStatus.and.returnValue(Promise.resolve(false));
	// 	component.getPrivacyToggleStatusVal();
	// 	fixture.detectChanges();

	// 	tick(10);
	// 	const result = component.privacyGuardToggleStatus;
	// 	clearInterval(component.privacyGuardInterval);
	// 	tick(10);

	// 	expect(result).toBe(false);
	// 	done();
	// }));


	// it('should get the privacy guard on password status is true', fakeAsync(() => {
	// 	fixture.detectChanges();
	// 	component.getPrivacyGuardOnPasswordCapabilityStatus();
	// 	tick(10);
	// 	const result = component.privacyGuardCheckBox;
	// 	expect(result).toBe(true);

	// }));

	// it('should get the privacy guard on password status is false', fakeAsync(() => {
	// 	displayServiceMock.getPrivacyGuardOnPasswordStatus.and.returnValue(Promise.resolve(false));
	// 	fixture.detectChanges();
	// 	component.getPrivacyGuardOnPasswordCapabilityStatus();
	// 	tick(10);
	// 	const result = component.privacyGuardCheckBox;
	// 	expect(result).toBe(false);

	// }));


	// it('should set the privacy guard toggle status is true', fakeAsync(() => {
	// 	fixture.detectChanges();
	// 	component.setPrivacyGuardToggleStatus({ switchValue: true });
	// 	tick(10);
	// 	const result = component.isToggleResponse;
	// 	expect(result).toBe(true);

	// }));

	// it('should set the privacy guard toggle status is false', fakeAsync(() => {
	// 	displayServiceMock.setPrivacyGuardStatus.and.returnValue(Promise.resolve(false));
	// 	component.setPrivacyGuardToggleStatus({ switchValue: false });
	// 	fixture.detectChanges();

	// 	tick(10);
	// 	const result = component.isToggleResponse;
	// 	expect(result).toBe(false);

	// }));

	// it('should set the privacy guard on password check box status is true', fakeAsync(() => {
	// 	component.setPrivacyGuardOnPasswordStatusVal({ target: { checked: true } });
	// 	component.privacyGuardCheckBox = true;
	// 	fixture.detectChanges();

	// 	tick(10);
	// 	const result = component.isOnPswdStatus;
	// 	expect(result).toBe(true);

	// }));

	// it('should set the privacy guard on password check box status is false', fakeAsync(() => {
	// 	displayServiceMock.setPrivacyGuardOnPasswordStatus.and.returnValue(Promise.resolve(false));
	// 	component.setPrivacyGuardOnPasswordStatusVal({ target: { checked: false } });
	// 	component.privacyGuardCheckBox = false;
	// 	fixture.detectChanges();

	// 	tick(10);
	// 	const result = component.isOnPswdStatus;
	// 	expect(result).toBe(false);

	// }));
});


// /**
//  * @param options pipeName which has to be mock
//  * @description To mock the pipe.
//  * @summary This has to move to one utils file.
//  */
// export function mockPipe(options: Pipe): Pipe {
// 	const metadata: Pipe = {
// 		name: options.name
// 	};
// 	return <any>Pipe(metadata)(class MockPipe {
// 		public transform(query: string, ...args: any[]): any {
// 			return query;
// 		}
// 	});
// }
