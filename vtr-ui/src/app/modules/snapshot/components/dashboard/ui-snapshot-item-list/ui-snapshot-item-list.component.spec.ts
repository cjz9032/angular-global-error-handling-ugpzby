import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SnapshotHardwareComponents } from '../../../enums/snapshot.enum';
import { UiSnapshotItemListComponent } from './ui-snapshot-item-list.component';

describe('UiSnapshotItemListComponent', () => {
	let component: UiSnapshotItemListComponent;
	let fixture: ComponentFixture<UiSnapshotItemListComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [UiSnapshotItemListComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSnapshotItemListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get correct spec string to DisplayDevices when call getMetricsName', () => {
		const metricsName = component.getMetricsName(
			SnapshotHardwareComponents[SnapshotHardwareComponents.DisplayDevices]
		);

		expect(metricsName).toBe('Display');
	});

	it('should get same device name to unkown devices when call getMetricsName', () => {
		const unkownDevice = 'UnknownDevice';
		const metricsName = component.getMetricsName(unkownDevice);

		expect(metricsName).toBe(unkownDevice);
	});
});
