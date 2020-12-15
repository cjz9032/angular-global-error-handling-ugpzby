import { ComponentFixture, fakeAsync, TestBed, waitForAsync, tick } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { UiToggleComponent } from './ui-toggle.component';
import { CommonService } from 'src/app/services/common/common.service';
import { BehaviorSubject } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';

describe('UiToggleComponent', () => {
	let component: UiToggleComponent;
	let fixture: ComponentFixture<UiToggleComponent>;
	let appnotification: AppNotification;
	const commonServiceSpy = {
		isOnline: true,
		notification: new BehaviorSubject<AppNotification>(new AppNotification('init')),
		getShellVersion: () => '1.1.1.1',
		compareVersion: (version1, version2) => 1,
		sendNotification: (action, payload) => {},
	};

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiToggleComponent],
			providers: [
				{ provide: CommonService, useValue: commonServiceSpy }
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiToggleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', fakeAsync(() => {
		expect(component).toBeTruthy();

		component.onOffSwitchId = 'onOffSwitchId';
		appnotification = { type: 'onOffSwitchId', payload: true };
		component.value = false;
				setTimeout(() => {
					commonServiceSpy.notification.next(appnotification);
				}, 20);
				tick(100);
				expect(component.value).toBe(true);
	}));

	it('should call onNgDestory', () => {
		component.uiSubscription = new Subscription();
		component.ngOnDestroy();
	});

	it('should call ngOnChanges', async () => {
		const result = await component.ngOnChanges({ messageData: undefined });
		expect(result).toEqual(undefined);
	});

	it('should call sendChangeEvent', fakeAsync(() => {
		component.disabled = false;
		component.sendChangeEvent(null);
		expect(component.currentEvent).toBe(null);

		component.disabled = true;
		component.notChange = false;
		let event = { target: { switchValue: 4, value: 'true' } };
		component.sendChangeEvent(event);
		tick(100);
		expect(component.currentEvent).toEqual(event);

		component.notChange = true;
		component.value = false;
		event = { target: { switchValue: 4, value: 'false' } };
		component.sendChangeEvent(event);
		tick(100);
		expect(component.currentEvent).toEqual(event);
	}));

	it('should call stopPropagation', () => {
		const eventSpy = new Event('stopPropagation');
		component.stopPropagation(eventSpy);
	});

	it('should call hideColorPicker', () => {
		component.hideColorPicker();

		const dummyElement = document.createElement('div');
		dummyElement.id = 'onOffSwitchId_toggle_on';
		document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

		component.hideColorPicker();
		expect(dummyElement.style.display).toBe('none');
	});
});
