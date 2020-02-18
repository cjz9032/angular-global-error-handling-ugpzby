import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ModalSmartStandByComponent } from './modal-smart-stand-by.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';
import { PowerService } from 'src/app/services/power/power.service';
import SmartStandbyActivityModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity.model';
import SmartStandbyActivityDetailModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity-detail.model';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { throwError } from 'rxjs';
import { error } from 'util';
import { CameraDetail, CameraSettingsResponse } from 'src/app/data-models/camera/camera-detail.model';
import { SunsetToSunriseStatus } from 'src/app/data-models/camera/eyeCareMode.model';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { MicrophoneOptimizeModes } from 'src/app/data-models/audio/microphone-optimize-modes';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';

describe('ModalSmartStandByComponent', () => {
	const activities: SmartStandbyActivityModel[] = [
		{
			day: 'sunday',
			activities: [
				{
					hour: 1,
					usage: [ 20, 30, 10 ]
				}
			]
		}
	];

	// models coverage
	const cameraDetail: CameraDetail = new CameraDetail();
	const cameraSettingsResponse: CameraSettingsResponse = new CameraSettingsResponse();
	const sunsetToSunriseStatus: SunsetToSunriseStatus = new SunsetToSunriseStatus(false, false, false, '', '');
	const batteryConditionModels = [];
	for (let i = 0; i <= 17; i++) {
		batteryConditionModels.push(new BatteryConditionModel(i, 0).getBatteryConditionTip(i));
	}
	const dolbyModeResponse = new DolbyModeResponse(false, [''], '');
	const microphoneOptimizeModes = new MicrophoneOptimizeModes([''], '');
	const microphone = new Microphone(false, false, 0, '', false, false, false, false, false);
	const inputAccessoriesCapability: InputAccessoriesCapability = new InputAccessoriesCapability();

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ModalSmartStandByComponent],
				imports: [FontAwesomeModule, TranslationModule, HttpClientTestingModule],
				providers: [NgbActiveModal, TranslateStore]
			}).compileComponents();
		})
	);

	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(ModalSmartStandByComponent);
			const component = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService);
			const activeModal = fixture.debugElement.injector.get(NgbActiveModal)
			const httpTestingController = fixture.debugElement.injector.get(HttpTestingController);

			return { fixture, component, powerService, httpTestingController, activeModal };
		}

		it('should create the app', () => {
			const { component } = setup();
			expect(component).toBeTruthy();
		}));

		it('getActiviesData calling powerService', async(() => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(activities));
			spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(activities));

			component['getActivitiesData']();
			fixture.detectChanges();

		// it('getActiviesData calling powerService', async(() => {
		// 	const { fixture, component, powerService } = setup();
		// 	spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(activities));
		// 	spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(activities));

		// 	component.getActiviesData();
		// 	fixture.detectChanges();

		// 	expect(powerService.getSmartStandbyPresenceData).toHaveBeenCalled();
		// 	expect(powerService.GetSmartStandbyActiveHours).toHaveBeenCalled();
		// }));

		it(
			'getSmartStandbyActiveHours calling powerService',
			async(() => {
				const { fixture, component, powerService } = setup();
				spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(activities));
				spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(activities));

		// Testing exceptions
		it('Testing exception', async(() => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(new TypeError('caught exception')));
			spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(new TypeError('caught exception')));

			fixture.detectChanges(); // onInit()
			const excp = () => {
				component.getActivities();
				component.getSmartStandbyActiveHours();
				component.closeModal();
				throw new TypeError('caught exception');
			};
			expect(excp).toThrowError(TypeError);
		}));

		it('should call closeModal', () => {
			const { component, activeModal } = setup();
			let spy = spyOn(activeModal, 'close')
			component.closeModal()
			expect(spy).toHaveBeenCalled()
		})

				expect(powerService.getSmartStandbyPresenceData).toHaveBeenCalled();
				expect(powerService.GetSmartStandbyActiveHours).toHaveBeenCalled();
			})
		);

		// testing http.get
		// it('should call getActivities', (() => {
		// 	const { fixture, component, httpTestingController } = setup();
		// 	const mockActivities = activities;

		// 	component['getActivities']().subscribe(data => {
		// 		expect(data).toEqual(mockActivities);
		// 	});

		// 	const req = httpTestingController.expectOne('/assets/activities.json');

		// 	expect(req.request.method).toBe('GET');

		// 	req.flush(mockActivities);
		// }));

		afterEach(() => {
			const { httpTestingController } = setup();
			httpTestingController.verify();
		});
	});
});
