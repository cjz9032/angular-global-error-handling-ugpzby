import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPageLayoutComponent } from './subpage-layout.component';

describe('SubpageLayoutComponent', () => {
	let component: SubPageLayoutComponent;
	let fixture: ComponentFixture<SubPageLayoutComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SubPageLayoutComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubPageLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
