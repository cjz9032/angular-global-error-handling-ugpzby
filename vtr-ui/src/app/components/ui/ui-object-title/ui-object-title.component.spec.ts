import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiObjectTitleComponent } from './ui-object-title.component';

xdescribe('UiObjectTitleComponent', () => {
	let component: UiObjectTitleComponent;
	let fixture: ComponentFixture<UiObjectTitleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiObjectTitleComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiObjectTitleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
