import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMainLegacyComponent } from './menu-main-legacy.component';

describe('MenuMainLegacyComponent', () => {
	let component: MenuMainLegacyComponent;
	let fixture: ComponentFixture<MenuMainLegacyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MenuMainLegacyComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MenuMainLegacyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
