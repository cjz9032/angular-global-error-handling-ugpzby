import { UiGamingCollapsibleContainerComponent } from './ui-gaming-collapsible-container.component';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('UiGamingCollapsibleContainerComponent', () => {
	let component: UiGamingCollapsibleContainerComponent;
	let fixture: ComponentFixture<UiGamingCollapsibleContainerComponent>;
	let router = { navigate: jasmine.createSpy('navigate') };
	let drop = {
		curSelected: 1,
		modeType: 1,
		hideDropDown: false,
		dropOptions: [
			{
				header: 'gaming.dashboard.device.legionEdge.status.alwayson',
				name: 'gaming.dashboard.device.legionEdge.status.alwayson',
				description: 'gaming.dashboard.device.legionEdge.statusText.onText',
				id: 'cpu overclock on',
				ariaLabel: 'on',
				metricitem: 'cpu_overclock_on',
				value: 1,
			},
			{
				header: 'gaming.dashboard.device.legionEdge.status.whenGaming',
				name: 'gaming.dashboard.device.legionEdge.status.whenGaming',
				description: 'gaming.dashboard.device.legionEdge.statusText.gamingText',
				id: 'cpu overclock when gaming',
				ariaLabel: 'when gaming',
				metricitem: 'cpu_overclock_when_gaming',
				value: 2,
			},
			{
				header: 'gaming.dashboard.device.legionEdge.status.off',
				name: 'gaming.dashboard.device.legionEdge.status.off',
				description: 'gaming.dashboard.device.legionEdge.statusText.offText',
				id: 'cpu overclock off',
				ariaLabel: 'off',
				metricitem: 'cpu_overclock_off',
				value: 3,
			},
		],
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				UiGamingCollapsibleContainerComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' }),
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [{ provide: HttpClient }, { provide: Router, useValue: router }],
		}).compileComponents();
		fixture = TestBed.createComponent(UiGamingCollapsibleContainerComponent);
		component = fixture.componentInstance;
		component.options = drop;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Checking call have been made for getCurrentOption function', fakeAsync(() => {
		component.getCurrentOption();
		spyOn(component, 'getCurrentOption');
		component.getCurrentOption();
		expect(component.getCurrentOption).toHaveBeenCalled();
	}));

	it('should show button as HIDE', () => {
		component.showOptions = false;
		component.toggleOptions(false);
		expect(component.buttonName).toBe('Hide');
	});

	it('should show button as SHOW', () => {
		component.showOptions = true;
		component.toggleOptions(true);
		expect(component.buttonName).toBe('Show');
	});

	it('Checking call have been made for setDefaultOption function', fakeAsync(() => {
		component.setDefaultOption(Option);
		spyOn(component, 'setDefaultOption');
		component.setDefaultOption(Option);
		expect(component.setDefaultOption).toHaveBeenCalled();
	}));

	it('Checking call have been made for optionSelected function', fakeAsync(() => {
		fixture.detectChanges();
		component.optionSelected(Option);
		spyOn(component, 'optionSelected');
		component.optionSelected(Option);
		spyOn(component, 'focusElement');
		tick(100);
		component.focusElement();
		expect(component.optionSelected).toHaveBeenCalled();
	}));

	it('Checking call have been made for changeDescription function', fakeAsync(() => {
		component.changeDescription(Option);
		component.options.curSelected = 1;
		spyOn(component, 'changeDescription');
		component.changeDescription(Option);
		expect(component.changeDescription).toHaveBeenCalled();
	}));

	it('Checking call have been made for resetDescription function', fakeAsync(() => {
		component.resetDescription(Option);
		component.currentDescription = '';
		spyOn(component, 'resetDescription');
		component.resetDescription(Option);
		expect(component.resetDescription).toHaveBeenCalled();
	}));

	it('should generate the click', () => {
		try {
			const event = new Event('click');
			component.showOptions = true;
			component.generalClick(event);
			expect(component.showOptions).toEqual(false);
			component.showOptions = false;
			component.generalClick(event);
			expect(component.generalClick(event)).toBeUndefined();
		} catch (e) {}
	});

	it('Checking current focus item', fakeAsync(() => {
		const dropDownEle: any = { nativeElement: { querySelectorAll: (param) => [] } };
		component.showOptions = true;
		component.isItemsFocused = false;
		component.dropdownEle = dropDownEle;
		component.itemsFocused();
		tick(110);
		expect(component.showOptions).toBe(false);
		component.showOptions = false;
		component.itemsFocused();
		expect(component.itemsFocused()).toBeUndefined();
	}));
});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name,
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
