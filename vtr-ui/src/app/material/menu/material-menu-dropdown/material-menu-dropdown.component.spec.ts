import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMenuDropdownComponent } from './material-menu-dropdown.component';

describe('MaterialMenuDropdownComponent', () => {
	let component: MaterialMenuDropdownComponent;
	let fixture: ComponentFixture<MaterialMenuDropdownComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MaterialMenuDropdownComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MaterialMenuDropdownComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
