import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SnapshotStatus } from '../../enums/snapshot-enum';
import { SnapshotService } from '../../services/snapshot.service';
import { SnapshotHeaderComponent } from './snapshot-header.component';

fdescribe('SnapshotHeaderComponent', () => {
	let component: SnapshotHeaderComponent;
	let fixture: ComponentFixture<SnapshotHeaderComponent>;

	const snapshotService = jasmine.createSpyObj('snapshotService', ['getLoadProcessorsInfo']);
	const shellService = jasmine.createSpyObj('shellService', ['getSnapshot']);

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SnapshotHeaderComponent],
			providers: [
				{
					provide: VantageShellService,
					useValue: shellService,
				},
				{
					provide: SnapshotService,
					useValue: snapshotService,
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SnapshotHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	fit('should show the Perform a snapshot title when snapshot screen starts', () => {
		const snapshotNotStartedDescription = 'snapshot.titleNotStarted';

		component.snapshotStatus = SnapshotStatus.NotStarted;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(By.css('#snapshot-title')).nativeElement;

		expect(descriptionElement.textContent).toEqual(snapshotNotStartedDescription);
	});

	fit('should show the inProgress title when an update is started', () => {
		const snapshotInProgressDescription = 'snapshot.titleSnapshotInProgress';

		component.snapshotStatus = SnapshotStatus.SnapshotInProgress;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(By.css('#snapshot-title')).nativeElement;

		expect(descriptionElement.textContent).toEqual(snapshotInProgressDescription);
	});

	fit('should show the completed title when an update is completed', () => {
		const snapshotCompletedDescription = 'snapshot.titleSnapshotCompleted';

		component.snapshotStatus = SnapshotStatus.SnapshotCompleted;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(By.css('#snapshot-title')).nativeElement;

		expect(descriptionElement.textContent).toEqual(snapshotCompletedDescription);
	});

	fit('should show the inProgress title when a replace baseline is started', () => {
		const snapshotBaselineDescription = 'snapshot.titleBaselineInProgress';

		component.snapshotStatus = SnapshotStatus.BaselineInProgress;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(By.css('#snapshot-title')).nativeElement;

		expect(descriptionElement.textContent).toEqual(snapshotBaselineDescription);
	});

	fit('should show the completed title when a replace is finished', () => {
		const snapshotBaselineCompletedDescription = 'snapshot.titleBaselineCompleted';

		component.snapshotStatus = SnapshotStatus.BaselineCompleted;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(By.css('#snapshot-title')).nativeElement;

		expect(descriptionElement.textContent).toEqual(snapshotBaselineCompletedDescription);
	});
});
