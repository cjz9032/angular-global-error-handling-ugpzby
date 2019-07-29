import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMacrokeyCollapsibleContainerComponent } from './ui-macrokey-collapsible-container.component';

xdescribe('UiMacrokeyCollapsibleContainerComponent', () => {
	let component: UiMacrokeyCollapsibleContainerComponent;
	let fixture: ComponentFixture<UiMacrokeyCollapsibleContainerComponent>;

	beforeEach(
		 async(() => {
			TestBed.configureTestingModule({
				declarations: [ UiMacrokeyCollapsibleContainerComponent ]
			}).compileComponents();
		 })
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(UiMacrokeyCollapsibleContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
