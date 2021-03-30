import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportLogErrorStatus } from '../../../enums/snapshot.enum';
import { By } from '@angular/platform-browser';

import { ModalExportLogComponent } from './modal-export-log.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from 'src/app/services/device/device.service';

describe('ModalExportLogComponent', () => {
	let component: ModalExportLogComponent;
	let fixture: ComponentFixture<ModalExportLogComponent>;

	const ngbActiveModal = jasmine.createSpyObj('ngbActiveModal', ['close']);
	const deviceService = jasmine.createSpyObj('deviceService', ['launchUri']);

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ModalExportLogComponent],
			providers: [
				{
					provide: NgbActiveModal,
					useValue: ngbActiveModal,
				},
				{
					provide: DeviceService,
					useValue: deviceService,
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalExportLogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should use the success description when receive success status', () => {
		const successDescriptionToken = 'snapshot.exportLogModal.exportSuccessDescription ';
		const logPathMocked = ' C://User//Documents';
		const pathMocked = successDescriptionToken + logPathMocked;

		component.logPath = logPathMocked;
		component.errorStatus = ExportLogErrorStatus.SuccessExport;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(
			By.css('#snapshot-export-log-modal-description')
		).nativeElement;

		expect(descriptionElement.textContent).toEqual(pathMocked);
	});

	it('should use the access denied description when receive access denied error status', () => {
		const AccessDeniedDescriptionToken = 'snapshot.exportLogModal.exportAccessErrorDescription';

		component.errorStatus = ExportLogErrorStatus.AccessDenied;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(
			By.css('#snapshot-export-log-modal-description')
		).nativeElement;

		expect(descriptionElement.textContent).toEqual(AccessDeniedDescriptionToken);
	});

	it('should use the error description when receive generic error status', () => {
		const ErrorDescriptionToken = 'snapshot.exportLogModal.exportFailDescription';

		component.errorStatus = ExportLogErrorStatus.GenericError;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(
			By.css('#snapshot-export-log-modal-description')
		).nativeElement;

		expect(descriptionElement.textContent).toEqual(ErrorDescriptionToken);
	});

	it('should use the error description when receive undefined value', () => {
		const ErrorDescriptionToken = 'snapshot.exportLogModal.exportFailDescription';

		component.errorStatus = undefined;
		fixture.detectChanges();

		const descriptionElement = fixture.debugElement.query(
			By.css('#snapshot-export-log-modal-description')
		).nativeElement;

		expect(descriptionElement.textContent).toEqual(ErrorDescriptionToken);
	});
});
