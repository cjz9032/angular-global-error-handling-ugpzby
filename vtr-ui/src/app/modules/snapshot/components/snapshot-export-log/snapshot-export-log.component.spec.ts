import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@lenovo/material/dialog';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ExportSnapshotResultsService } from '../../services/export-snapshot-results.service';

import { SnapshotExportLogComponent } from './snapshot-export-log.component';

describe('SnapshotExportLogComponent', () => {
	let component: SnapshotExportLogComponent;
	let fixture: ComponentFixture<SnapshotExportLogComponent>;

	const deviceServiceSpy = jasmine.createSpyObj('deviceService', ['getMachineInfo']);
	const loggerService = jasmine.createSpyObj('loggerService', ['exception']);
	const matDialog = jasmine.createSpyObj('matDialog', ['open']);
	const exportService = jasmine.createSpyObj('exportService', [
		'setExportExtensionSelected',
		'exportSnapshotResults',
		'sendTaskActionMetrics',
	]);

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [SnapshotExportLogComponent],
				imports: [TranslateModule.forRoot()],
				providers: [
					{
						provide: LoggerService,
						useValue: loggerService,
					},
					{
						provide: DeviceService,
						useValue: deviceServiceSpy,
					},
					{
						provide: ExportSnapshotResultsService,
						useValue: exportService,
					},
					{
						provide: MatDialog,
						useValue: matDialog,
					},
					TranslatePipe,
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		deviceServiceSpy.getMachineInfo.and.returnValue(Promise.resolve({ locale: 'pt' }));
		fixture = TestBed.createComponent(SnapshotExportLogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should return disabled icon', () => {
		component.isDisabled = true;
		const iconSrc = component.getExportIcon();

		expect(iconSrc).toBe(
			'assets/icons/snapshot/disabled/icon_snapshot_export-log_disabled.svg'
		);
	});

	it('should return enabled icon', () => {
		component.isDisabled = false;
		const iconSrc = component.getExportIcon();

		expect(iconSrc).toBe('assets/icons/snapshot/icon_snapshot_export-log.svg');
	});
});
