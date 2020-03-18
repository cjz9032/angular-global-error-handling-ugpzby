import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SmartStandbyGraphComponent } from './smart-standby-graph.component';
import { HttpClientModule } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import SmartStandbyActivityModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity.model';
import SmartStandbyActivityDetailModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity-detail.model';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, Observer } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('SmartStandbyGraphComponent', () => {

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
			declarations: [SmartStandbyGraphComponent],
			imports: [FontAwesomeModule, TranslationModule, HttpClientTestingModule],
			providers: [TranslateStore]
		}).compileComponents();
	}));


	describe(':', () => {

		function setup() {
			const fixture = TestBed.createComponent(SmartStandbyGraphComponent);
			const component = fixture.debugElement.componentInstance;
			// const powerService = fixture.debugElement.injector.get(PowerService);

			const httpTestingController = fixture.debugElement.injector.get(HttpTestingController);

			return { fixture, component, httpTestingController };
		}

		it('should create the app', (() => {
			const { component } = setup();
			expect(component).toBeTruthy();
		}));

		it('should call getActivities, renderChart', fakeAsync(() => {
			const { fixture, component } = setup();
			spyOn(component, 'renderChart');
			let mockActivities = activities;

			spyOn(component, 'getActivities').and.returnValue(
				Observable.create((observer: Observer<SmartStandbyActivityModel[]>) => {
					observer.next(mockActivities);
					return observer;
				})
			);

			tick();
			fixture.detectChanges();// ngOnInit
			expect(component.renderChart).toHaveBeenCalled();
			expect(component.getActivities).toHaveBeenCalled();
		}));

		// not async func
		it('should render chart', (() => {
			const { fixture, component } = setup();
			// spyOn(component, 'renderChart');

			fixture.detectChanges();
			component.renderChart(activities);

			let dom = fixture.debugElement.nativeElement.querySelector('div[class^="app-smart-standby-activity"]');
			// console.log(dom);
			expect(dom).toBeTruthy();

		}));

		// testing http.get
		it('should call http get', (() => {
			const { fixture, component, httpTestingController } = setup();
			let mockActivities = activities;

			component.getActivities().subscribe(data => {
				expect(data).toEqual(mockActivities);
			});

			const req = httpTestingController.expectOne('assets/activities.json');

			expect(req.request.method).toBe('GET');

			req.flush(mockActivities);
		}));

		// afterEach(() => {
		// 	const { httpTestingController } = setup();
		// 	httpTestingController.verify();
		// });

	});
});
