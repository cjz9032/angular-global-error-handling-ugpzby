import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialHamburgerMenuComponent } from './material-hamburger-menu.component';

describe('MaterialHamburgerMenuComponent', () => {
	let component: MaterialHamburgerMenuComponent;
	let fixture: ComponentFixture<MaterialHamburgerMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MaterialHamburgerMenuComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MaterialHamburgerMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
