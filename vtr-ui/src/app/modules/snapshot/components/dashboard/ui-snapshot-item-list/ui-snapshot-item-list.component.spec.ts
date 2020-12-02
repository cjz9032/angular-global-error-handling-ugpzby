import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UiSnapshotItemListComponent } from './ui-snapshot-item-list.component';

describe('UiSnapshotItemListComponent', () => {
	let component: UiSnapshotItemListComponent;
	let fixture: ComponentFixture<UiSnapshotItemListComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiSnapshotItemListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSnapshotItemListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
