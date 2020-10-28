import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMainGamingComponent } from './menu-main-gaming.component';

describe('MenuMainGamingComponent', () => {
	let component: MenuMainGamingComponent;
	let fixture: ComponentFixture<MenuMainGamingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MenuMainGamingComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MenuMainGamingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
