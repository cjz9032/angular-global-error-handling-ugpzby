import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { UiHeaderSubpageComponent } from './ui-header-subpage.component';
import { TranslateModule } from "@ngx-translate/core";

describe('UiHeaderSubpageComponent', () => {
	let component: UiHeaderSubpageComponent;
	let fixture: ComponentFixture<UiHeaderSubpageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [UiHeaderSubpageComponent],
			imports: [TranslateModule.forRoot()]
		}).compileComponents();
	}));

	it('#UiHeaderSubpageComponent should create', () => {
		fixture = TestBed.createComponent(UiHeaderSubpageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges()
		expect(component).toBeTruthy();
	});

	it('should call menuItemClick', () => {
		fixture = TestBed.createComponent(UiHeaderSubpageComponent);
		component = fixture.componentInstance;
		const event = {type: 'hover'}
		const item = {
			metricsItem: "BatterySettings",
			order: 3,
			path: "battery",
			title: "device.deviceSettings.power.batterySettings.title"
		}
		const childElement = document.createElement('LI')
		childElement.tabIndex = 0
		const element = document.createElement('div')
		element.appendChild(childElement)
		document.querySelector = jasmine.createSpy('HTML Element').and.returnValue(element)
		const spy = spyOn(childElement, 'focus')
		component.menuItemClick(event, item)
		expect(spy).toHaveBeenCalled()
	});

	it('should call menuItemClick - event type is click', () => {
		fixture = TestBed.createComponent(UiHeaderSubpageComponent);
		component = fixture.componentInstance;
		const event = {type: 'click'}
		const item = {
			metricsItem: "BatterySettings",
			order: 3,
			path: "battery",
			title: "device.deviceSettings.power.batterySettings.title"
		}
		const childElement = document.createElement('LI')
		childElement.tabIndex = 0
		const element = document.createElement('div')
		element.appendChild(childElement)
		document.querySelector = jasmine.createSpy('HTML Element').and.returnValue(element)
		const spy = spyOn(childElement, 'focus')
		component.menuItemClick(event, item)
		expect(spy).not.toHaveBeenCalled()
	});

	it('should call menuItemClick - if no element', () => {
		fixture = TestBed.createComponent(UiHeaderSubpageComponent);
		component = fixture.componentInstance;
		const event = {type: 'click'}
		const item = {}
		// const element = document.createElement('LI')
		// document.querySelector = jasmine.createSpy('HTML Element').and.returnValue(element)
		const spy = spyOn(window, 'scroll')
		component.menuItemClick(event, item)
		expect(spy).not.toHaveBeenCalled()
	});
});
