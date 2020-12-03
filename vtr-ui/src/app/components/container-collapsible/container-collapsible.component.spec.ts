import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContainerCollapsibleComponent } from './container-collapsible.component';

xdescribe('ContainerCollapsibleComponent', () => {
	let component: ContainerCollapsibleComponent;
	let fixture: ComponentFixture<ContainerCollapsibleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ContainerCollapsibleComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContainerCollapsibleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
