import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDropDownComponent } from './ui-dropdown.component';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';

const interval = [{
	name: 'Always on',
	value: 0,
	placeholder: '',
	text: 'Always on'
},
{
	name: '30',
	value: 1,
	placeholder: 'seconds',
	text: '30 seconds'
},
{
	name: '1',
	value: 2,
	placeholder: 'minute',
	text: '1 minute'
},
{
	name: '15',
	value: 7,
	placeholder: 'minutes',
	text: '15 minutes'
},
{
	name: 'Never',
	value: 9,
	placeholder: '',
	text: 'Never'
},
{
	name: 'Half time of display off timer',
	value: 10,
	placeholder: '',
	text: 'Half time of display off timer'
}]

describe('UiDropdownComponent', () => {
	let component: UiDropDownComponent;
	let fixture: ComponentFixture<UiDropDownComponent>;
	let logger: LoggerService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiDropDownComponent],
			providers: [LoggerService],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule]
		})
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDropDownComponent);
		component = fixture.componentInstance;
	})

	it('should create', async(() => {
		component.dropDownId = 'oled-taskbar-dimmer-dropDown';
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call setDropValue when and list and value available', () => {
		component.list = [ ...interval ];
		component.value = 0;
		component.dropDownId = 'oled-taskbar-dimmer-dropDown';
		fixture.detectChanges();
		component.setDropDownValue();
		expect(component.name).toBe('Always on')
	});

	it('should call setDropValue when and list and value not available', () => {
		component.list = [];
		component.value = 0;
		component.dropDownId = 'oled-taskbar-dimmer-dropDown';
		fixture.detectChanges();
		component.setDropDownValue();
		expect(component.name).toBeUndefined()
	});

	it('should call toggleList when disabled is false', () => {
		component.disabled = false;
		const event = new Event('click')
		component.toggleList(event)
		expect(component.applyFocusClass).toEqual(false)
	});

	it('should call toggleList when disabled is true', () => {
		component.disabled = true;
		const event = new Event('click')
		component.toggleList(event)
		expect(component.applyFocusClass).toEqual(undefined)
	});

	it('should call closeDropdown - try block', () => {
		const eventObj = {value: 2, hideList: false};
		component.list = [ ...interval ];
		spyOn(component, 'settingDimmerIntervals')
		component.closeDropdown(eventObj)
		expect(component.isDropDownOpen).toBe(false)
	});

	it('should call closeDropdown - try block else condition', () => {
		const eventObj = {hideList: false};
		component.list = [ ...interval ];
		const spy = spyOn(component, 'settingDimmerIntervals')
		component.closeDropdown(eventObj)
		expect(spy).not.toHaveBeenCalled()
	});

	it('should call closeDropdown - catch block', () => {
		const eventObj = undefined;
		logger = TestBed.get(LoggerService)
		const spy = spyOn(logger, 'error')
		component.closeDropdown(eventObj)
		expect(spy).toHaveBeenCalled()
	});

	// it('should call customCamelCase - when value null', () => {
	// 	const value = null
	// 	expect(component.customCamelCase(value)).toEqual('')
	// });

	// it('should call customCaseCase - when some value starts with digit', () => {
	// 	const value = '1 minute'
	// 	expect(component.customCamelCase(value)).toEqual('1 Minute')
	// });

	// it('should call customCaseCase - when some value starts with string', () => {
	// 	const value = 'never'
	// 	expect(component.customCamelCase(value)).toEqual('Never')
	// });
});
