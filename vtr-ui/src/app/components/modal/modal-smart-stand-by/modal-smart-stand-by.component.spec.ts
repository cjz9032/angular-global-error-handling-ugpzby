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

describe('ModalSmartStandByComponent', () => {

	const activities: SmartStandbyActivityModel[] = [
		{
			day: 'sunday',
			activities: [
				{
					hour: 1,
					usage: [20, 30, 10]
				}
			]
		}
	];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalSmartStandByComponent],
			imports: [FontAwesomeModule, TranslationModule, HttpClientTestingModule],
			providers: [NgbActiveModal, TranslateStore]
		}).compileComponents();
	}));

	describe(':', () => {

		function setup() {
			const fixture = TestBed.createComponent(ModalSmartStandByComponent);
			const component = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService);

			const httpTestingController = fixture.debugElement.injector.get(HttpTestingController);

			return { fixture, component, powerService, httpTestingController };
		}

		it('should create the app', (() => {
			const { component } = setup();
			expect(component).toBeTruthy();
		}));

		it('getActiviesData calling powerService', async(() => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(activities));
			spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(activities));

			component.getActiviesData();
			fixture.detectChanges();

			expect(powerService.getSmartStandbyPresenceData).toHaveBeenCalled();
			expect(powerService.GetSmartStandbyActiveHours).toHaveBeenCalled();
		}));

		it('getSmartStandbyActiveHours calling powerService', async(() => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(activities));
			spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(activities));

			component.getSmartStandbyActiveHours();
			fixture.detectChanges();

			expect(powerService.getSmartStandbyPresenceData).toHaveBeenCalled();
			expect(powerService.GetSmartStandbyActiveHours).toHaveBeenCalled();
		}));

		//Testing exceptions
		it('Testing exception', async(() => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'getSmartStandbyPresenceData').and.returnValue(Promise.resolve(new TypeError("caught exception")));
			spyOn(powerService, 'GetSmartStandbyActiveHours').and.returnValue(Promise.resolve(new TypeError("caught exception")));

			fixture.detectChanges();// onInit()
			let excp = function () {
				component.getActivities();
				component.getSmartStandbyActiveHours();
				component.closeModal();
				throw new TypeError("caught exception");
			};
			expect(excp).toThrowError(TypeError);
		}));




		//testing http.get
		it('should call getActivities', (() => {
			const { fixture, component, httpTestingController } = setup();
			let mockActivities = activities;

			component.getActivities().subscribe(data => {
				expect(data).toEqual(mockActivities);
			});

			const req = httpTestingController.expectOne('/assets/activities.json');

			expect(req.request.method).toBe('GET');

			req.flush(mockActivities);
		}));

		afterEach(() => {
			const { httpTestingController } = setup();
			httpTestingController.verify();
		});

	});
});
