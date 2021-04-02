import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialChevronComponent } from './material-chevron.component';

describe('MaterialChevronComponent', () => {
	let component: MaterialChevronComponent;
	let fixture: ComponentFixture<MaterialChevronComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MaterialChevronComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MaterialChevronComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
