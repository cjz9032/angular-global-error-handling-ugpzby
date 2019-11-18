import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './../../../services/language/language.service';
import { DeviceService } from './../../../services/device/device.service';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { UiMacrokeyCollapsibleContainerComponent } from './ui-macrokey-collapsible-container.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('UiMacrokeyCollapsibleContainerComponent', () => {
	let component: UiMacrokeyCollapsibleContainerComponent;
	let fixture: ComponentFixture<UiMacrokeyCollapsibleContainerComponent>;
	const mockLanguageService = {};
	const deviceServiceMock = { getMachineInfo: () => Promise.resolve({ locale: 'en' }) };
	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [UiMacrokeyCollapsibleContainerComponent,
					mockPipe({ name: 'translate' }),
					mockPipe({ name: 'sanitize' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [HttpClientModule, { provide: DeviceService, useValue: deviceServiceMock },
					{ provide: LanguageService, useValue: mockLanguageService },
					TranslateService]

			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(UiMacrokeyCollapsibleContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Button name should be Hide', () => {
		component.buttonName = 'Show';
		fixture.detectChanges();
		component.toggleOptions();
		expect(component.buttonName).toEqual('Hide');
	});

	it('Show options should be false', () => {
		component.setDefaultOption({});
		expect(component.showOptions).toEqual(false);
	});

	it('Options should be selected', () => {
		component.optionSelected({});
		expect(component.showOptions).toEqual(false);
	});

	it('Description should be same', () => {
		const option = { description: 'This is the test description' };
		component.changeDescription(option);
		expect(component.currentDescription).toEqual(option.description);
	});

	it('Show options should be false based on options', fakeAsync(() => {
		component.options = [1, 2, 3];
		tick(10);
		fixture.detectChanges();
		component.keydownFn({ keyCode: 9 }, 2);
		expect(component.showOptions).toEqual(false);
	}));

	it('Show options should be true based on general click', fakeAsync(() => {
		component.showOptions = true;
		tick(10);
		fixture.detectChanges();
		let event: Event;
		try {
			component.generalClick(event);
		} catch (e) {

		}
		expect(component.showOptions).toEqual(true);
	}));

	it('Should reset the current description', fakeAsync(() => {
		component.selectedDescription = 'this is the dummy description';
		tick(10);
		fixture.detectChanges();
		component.resetDescription({});
		expect(component.currentDescription).toEqual(component.selectedDescription);
	}));

	it('Shouldn\'t focus on the element', fakeAsync(() => {
		component.showOptions = false;
		component.isItemsFocused = false;
		tick(10);
		fixture.detectChanges();
		component.itemsFocused();
		expect(component.isItemsFocused).toEqual(false);
	}));

	it('Should call the ngOnChanges ', fakeAsync(() => {
		component.options = [{value: 1}, {value: 2}];
		tick(10);
		fixture.detectChanges();
		component.ngOnChanges({selectedValue: {currentValue: 1}});
		expect(component.selectedOption).toEqual({value: 1});
	}));
});
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}