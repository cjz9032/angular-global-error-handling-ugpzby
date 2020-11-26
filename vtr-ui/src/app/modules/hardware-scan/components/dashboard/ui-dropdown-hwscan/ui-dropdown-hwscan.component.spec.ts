import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDropdownHwscanComponent } from './ui-dropdown-hwscan.component';
const items = [{ name: 'sample' }, { name: 'sample2' }];
describe('UiDropdownHwscanComponent', () => {
	let component: UiDropdownHwscanComponent;
	let fixture: ComponentFixture<UiDropdownHwscanComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiDropdownHwscanComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDropdownHwscanComponent);
		component = fixture.componentInstance;
		component.items = items;
		component.subtitle = 'subtitle-testing1-subtitle-testing2-subtitle-testing3';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should call selected', () => {
		spyOn(component.selectedOption, 'emit');
		component.selected();
		expect(component.selectedOption.emit).toHaveBeenCalled();
	});
	it('should call select', () => {
		spyOn(component.selectedOption, 'emit');
		component.select('test');
		expect(component.selectedOption.emit).toHaveBeenCalled();
	});
});
