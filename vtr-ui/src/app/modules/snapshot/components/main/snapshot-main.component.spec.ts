import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotMainComponent } from './snapshot-main.component';

xdescribe('SnapshotMainComponent', () => {
	let component: SnapshotMainComponent;
	let fixture: ComponentFixture<SnapshotMainComponent>;

	beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ SnapshotMainComponent ]
	})
	.compileComponents();
	}));

	beforeEach(() => {
	fixture = TestBed.createComponent(SnapshotMainComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
	});

	it('should create', () => {
	expect(component).toBeTruthy();
	});
});
