import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSnapshotComponent } from './widget-snapshot.component';

xdescribe('WidgetSnapshotComponent', () => {
	let component: WidgetSnapshotComponent;
	let fixture: ComponentFixture<WidgetSnapshotComponent>;

	beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ WidgetSnapshotComponent ]
	})
	.compileComponents();
	}));

	beforeEach(() => {
	fixture = TestBed.createComponent(WidgetSnapshotComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
	});

	it('should create', () => {
	expect(component).toBeTruthy();
	});
});
