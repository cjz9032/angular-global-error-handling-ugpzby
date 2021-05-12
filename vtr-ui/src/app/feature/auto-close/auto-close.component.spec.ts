import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCloseComponent } from './auto-close.component';

describe('AutoCloseComponent', () => {
	let component: AutoCloseComponent;
	let fixture: ComponentFixture<AutoCloseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AutoCloseComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AutoCloseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
