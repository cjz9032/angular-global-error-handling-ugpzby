import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotHeaderComponent } from './snapshot-header.component';

describe('SnapshotHeaderComponent', () => {
	let component: SnapshotHeaderComponent;
	let fixture: ComponentFixture<SnapshotHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SnapshotHeaderComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SnapshotHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
