import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMenuComponent } from './material-menu.component';

describe('MenuComponent', () => {
	let component: MaterialMenuComponent;
	let fixture: ComponentFixture<MaterialMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MaterialMenuComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MaterialMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
