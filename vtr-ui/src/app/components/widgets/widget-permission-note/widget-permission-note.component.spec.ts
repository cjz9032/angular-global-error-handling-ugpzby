import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetPermissionNoteComponent } from './widget-permission-note.component';

xdescribe('WidgetPermissionNoteComponent', () => {
	let component: WidgetPermissionNoteComponent;
	let fixture: ComponentFixture<WidgetPermissionNoteComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetPermissionNoteComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetPermissionNoteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
