import { DeviceService } from 'src/app/services/device/device.service';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UiLightingEffectComponent } from './ui-lighting-effect.component';
import { HttpClientModule } from '@angular/common/http';

describe('UiLightingEffectComponent', () => {
	let component: UiLightingEffectComponent;
	let fixture: ComponentFixture<UiLightingEffectComponent>;

	const deviceServiceMock = { getMachineInfo: () => Promise.resolve({ locale: 'en' }) };
	const options = [
		{ description: 'desc1', value: 1 },
		{ description: 'desc2', value: 2 },
		{ description: 'desc3', value: 3 },
	];

	const dummyElement = document.createElement('div');
	dummyElement.id = 'menu-main-btn-navbar-toggler';
	document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				UiLightingEffectComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' }),
			],
			providers: [
				NgbModal,
				NgbActiveModal,
				{ provide: DeviceService, useValue: deviceServiceMock },
			],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientModule],
		}).compileComponents();
		fixture = TestBed.createComponent(UiLightingEffectComponent);
		component = fixture.componentInstance;
		component.selectedOption = {};
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show button as HIDE', () => {
		component.showOptions = false;
		component.toggleOptions();
		expect(component.buttonName).toBe('Hide');
	});

	it('should show button as SHOW', () => {
		component.showOptions = true;
		component.toggleOptions();
		expect(component.buttonName).toBe('Show');
	});

	it('should select the default option', () => {
		component.setDefaultOption({});
		expect(component.showOptions).toBe(false);
	});

	it('should select the default option', () => {
		const sampleDescription = 'sample description';
		component.changeDescription({ description: sampleDescription });
		expect(component.currentDescription).toBe(sampleDescription);
	});

	it('should select the optionSelected', () => {
		const sampleOption = { description: 'sample description', value: 8 };
		component.optionSelected(sampleOption);
		expect(component.selectedOption).toBe(sampleOption);
		component.isEffectChange = false;
		component.optionSelected(sampleOption);
		expect(component.optionSelected(sampleOption)).toBeUndefined();
		component.isEffectChange = true;
		component.optionSelected({ description: 'sample description', value: 2 });
		expect(
			component.optionSelected({ description: 'sample description', value: 2 })
		).toBeUndefined();
	});

	it('should reset the description', () => {
		const sampleOption = { description: 'sample description', value: 8 };
		component.selectedDescription = sampleOption.description;
		component.resetDescription(sampleOption);
		expect(component.currentDescription).toBe(sampleOption.description);
	});

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

	it('should send the keydown fun', () => {
		component.options = options;
		component.keydownFn({ keyCode: 9 }, 2);
		expect(component.showOptions).toBe(false);
		component.keydownFn({ keyCode: 9 }, 3);
		expect(component.keydownFn({ keyCode: 9 }, 3)).toBeUndefined();
		component.keydownFn({ keyCode: 11 }, 2);
		expect(component.keydownFn({ keyCode: 9 }, 2)).toBeUndefined();
	});

	it('should update based on changes', () => {
		component.options = { dropOptions: [...options] };
		component.ngOnChanges({ selectedValue: { currentValue: 1 } });
		expect(component.selectedOption).toBe(options[0]);
		component.selectedValue = 1;
		const changes = {
			options: {
				currentValue: {
					dropOptions: options,
				},
			},
		};
		component.ngOnChanges(changes);
		expect(component.selectedValue).toBe(1);
		component.options = undefined;
		component.ngOnChanges({});
		expect(component.ngOnChanges({})).toBeUndefined();
		component.selectedValue = undefined;
		component.ngOnChanges(changes);
		expect(component.ngOnChanges(changes)).toBeUndefined();
		const changes2 = {
			options: {
				currentValue: undefined,
			},
		};
		component.ngOnChanges(changes2);
		expect(component.ngOnChanges(changes2)).toBeUndefined();
	});

	it('should focus on the item', fakeAsync(() => {
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
