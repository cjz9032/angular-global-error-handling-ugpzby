import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMacrokeyComponent } from './page-macrokey.component';

xdescribe('PageMacrokeyComponent', () => {
	let component: PageMacrokeyComponent;
	let fixture: ComponentFixture<PageMacrokeyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageMacrokeyComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageMacrokeyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
