import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UiSnapshotItemComponent } from './ui-snapshot-item.component';

describe('UiSnapshotItemComponent', () => {
	let component: UiSnapshotItemComponent;
	let fixture: ComponentFixture<UiSnapshotItemComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [UiSnapshotItemComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSnapshotItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
