import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubpageDeviceSettingsDisplayComponent } from './subpage-device-settings-display.component';
import { Pipe } from '@angular/core';
import { DisplayService } from 'src/app/services/display/display.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Observable, Subject } from 'rxjs';
//const displayServiceMock = jasmine.createSpyObj('DisplayService', ['isShellAvailable', 'getPrivacyGuardCapability']);
// const mockSubject = new Subject<any>();
// const dataToReturn = {};
// const baseCameraDetailMock = {
// 	cameraDetailObservable() {
// 		return mockSubject.next(dataToReturn);
// 	}
// };

describe('SubpageDeviceSettingsDisplayComponent', () => {
	// let component: SubpageDeviceSettingsDisplayComponent;
	// let fixture: ComponentFixture<SubpageDeviceSettingsDisplayComponent>;
	// displayServiceMock.isShellAvailable.and.returnValue(true);

	// beforeEach(async(() => {
	// 	TestBed.configureTestingModule({
	// 		imports: [RouterTestingModule],
	// 		declarations: [SubpageDeviceSettingsDisplayComponent,
	// 			mockPipe({ name: 'translate' })],
	// 		schemas: [NO_ERRORS_SCHEMA],
	// 		providers: [{ provide: HttpClient }, { provide: DisplayService, useValue: displayServiceMock },
	// 		]
	// 	}).compileComponents();
	// 	fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();
	// }));

	// it('should create', () => {
	// 	expect(component).toBeTruthy();
	//   });

	// it('should update the lightining features for multi color', fakeAsync(() => {
	// 	component.privacyGuardCapability = true;
	// 	fixture.detectChanges();
	// 	displayServiceMock.getPrivacyGuardCapability.and.returnValue(Promise.resolve({}));
	// 	component.getPrivacyGuardCapabilityStatus();
	// 	tick(10);
	// 	expect(Object.keys(component.getPrivacyGuardCapabilityStatus).length).toBeGreaterThanOrEqual(1);
	//   }));
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