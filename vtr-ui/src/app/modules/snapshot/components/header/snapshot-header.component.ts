import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnapshotStatus } from 'src/app/modules/snapshot/enums/snapshot.enum';
import { SnapshotService } from '../../services/snapshot.service';
import { ModalSnapshotComponent } from '../modal/modal-snapshot/modal-snapshot.component';

@Component({
	selector: 'vtr-snapshot-header',
	templateUrl: './snapshot-header.component.html',
	styleUrls: ['./snapshot-header.component.scss'],
})
export class SnapshotHeaderComponent implements OnInit {
	// Input
	@Input() disableSnapshotButton: boolean;
	@Input() disableBaselineButton: boolean;
	@Input() snapshotStatus: SnapshotStatus = SnapshotStatus.NotStarted;

	public showSnapshotInformation = true;

	// Mocked data until has no call to bridge
	public snapshotComponents: any = {
		CdRomDrives: null,
		DisplayDevices: null,
		HardDrives: null,
		Keyboards: null,
		Memory: null,
		Motherboard: null,
		MouseDevices: null,
		Network: null,
		OperatingSystems: null,
		Printers: null,
		Processors: {
			BaselineDate: '12/04/2020 18:02:54',
			IsDifferent: true,
			Items: [
				{
					DeviceId: 'CPU0',
					DeviceTypeName: 'SystemInfoProcessors',
					IsDifferent: true,
					Properties: [
						{
							BaseValue: 'GenuineIntel',
							CurrentValue: 'GenuineIntel',
							IsDifferent: false,
							PropertyName: 'Snapshot_Processor_Manufacturer'
						},
						{
							BaseValue: '4',
							CurrentValue: '4',
							IsDifferent: false,
							PropertyName: 'Snapshot_Processor_Cores'
						},
						{
							BaseValue: 'Intel(R) Celeron',
							CurrentValue: 'Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz',
							IsDifferent: true,
							PropertyName: 'Snapshot_Processor_Name'
						},
						{
							BaseValue: '2',
							CurrentValue: '8',
							IsDifferent: true,
							PropertyName: 'SystemInfoProcessorsThreads'
						},
						{
							BaseValue: '198',
							CurrentValue: '198',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsFamily'
						},
						{
							BaseValue: '',
							CurrentValue: '',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsRevision'
						}
					],
					SubDevices: null
				},
				{
					DeviceId: 'L1 Cache-Unified',
					DeviceTypeName: 'L1 Cache',
					IsDifferent: false,
					Properties: [
						{
							BaseValue: 'L1 Cache',
							CurrentValue: 'L1 Cache',
							IsDifferent: false,
							PropertyName: 'CACHE'
						},
						{
							BaseValue: '3',
							CurrentValue: '3',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsLevel'
						},
						{
							BaseValue: 'Unified',
							CurrentValue: 'Unified',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsType'
						},
						{
							BaseValue: '256.00 KB',
							CurrentValue: '256.00 KB',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsSize'
						},
						{
							BaseValue: '8 way Set Associative',
							CurrentValue: '8 way Set Associative',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsAssociativity'
						}
					],
					SubDevices: null
				},
				{
					DeviceId: 'L2 Cache-Unified',
					DeviceTypeName: 'L2 Cache',
					IsDifferent: false,
					Properties: [
						{
							BaseValue: 'L2 Cache',
							CurrentValue: 'L2 Cache',
							IsDifferent: false,
							PropertyName: 'CACHE'
						},
						{
							BaseValue: '4',
							CurrentValue: '4',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsLevel'
						},
						{
							BaseValue: 'Unified',
							CurrentValue: 'Unified',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsType'
						},
						{
							BaseValue: '1.00 MB',
							CurrentValue: '1.00 MB',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsSize'
						},
						{
							BaseValue: '4 way Set Associative',
							CurrentValue: '4 way Set Associative',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsAssociativity'
						}
					],
					SubDevices: null
				},
				{
					DeviceId: 'L3 Cache-Unified',
					DeviceTypeName: 'L3 Cache',
					IsDifferent: false,
					Properties: [
						{
							BaseValue: 'L3 Cache',
							CurrentValue: 'L3 Cache',
							IsDifferent: false,
							PropertyName: 'CACHE'
						},
						{
							BaseValue: '5',
							CurrentValue: '5',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsLevel'
						},
						{
							BaseValue: 'Unified',
							CurrentValue: 'Unified',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsType'
						},
						{
							BaseValue: '8.00 MB',
							CurrentValue: '8.00 MB',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsSize'
						},
						{
							BaseValue: '16 way Set Associative',
							CurrentValue: '16 way Set Associative',
							IsDifferent: false,
							PropertyName: 'SystemInfoProcessorsAssociativity'
						}
					],
					SubDevices: null
				}
			],
			LastSnapshotDate: '12/04/2020 18:22:44'
		},
		Programs: null,
		ReturnCode: 2147483648,
		SoundCards: null,
		StartupPrograms: null,
		VideoCards: null,
		WebBrowsers: null
	};

	public snapshotInfo: any = {
		// Just a mock, should be separated when implement the real execution.
		hardwareList: this.snapshotComponents,
		softwareList: this.snapshotComponents
	};

	constructor(private snapshotService: SnapshotService,
				private modalService: NgbModal) { }

	ngOnInit() { }

	onTakeSnapshot() {
		this.showSnapshotInformation = false;
		this.disableSnapshotButton = true;
		this.disableBaselineButton = true;
		this.snapshotStatus = SnapshotStatus.SnapshotInProgress;
		// This is just to simulate a call on snapshotService
		this.snapshotService.getLoadProcessorsInfo()
		.then((async () => {
			await this.delay(5000);
		}))
		.finally(() =>
		{
			this.disableSnapshotButton = false;
			this.disableBaselineButton = false;
			this.snapshotStatus = SnapshotStatus.SnapshotCompleted;
		});
	}

	onReplaceBaseline() {
		const modalRef = this.modalService.open(ModalSnapshotComponent, {
			size: 'lg',
			centered: true,
			backdrop: true,
			windowClass: 'custom-modal-size',
		});
		modalRef.componentInstance.snapshotInfo = this.snapshotInfo;
		modalRef.componentInstance.passEntry.subscribe((response) => {
			this.showSnapshotInformation = false;
			this.disableSnapshotButton = true;
			this.disableBaselineButton = true;
			this.snapshotStatus = SnapshotStatus.BaselineInProgress;
			// This is just to simulate a call on snapshotService
			this.snapshotService.getLoadProcessorsInfo()
			.then((async () => {
				await this.delay(3000);
			}))
			.finally(() =>
			{
				this.disableSnapshotButton = false;
				this.disableBaselineButton = false;
				this.snapshotStatus = SnapshotStatus.BaselineCompleted;
			});
		});

		modalRef.componentInstance.modalClosing.subscribe((success) => {
			// Re-enabling the button, once the modal has been closed in a way
			// the user didn't started the Scan proccess.
			if (!success) {
				this.disableSnapshotButton = false;
				this.disableBaselineButton = false;
				this.snapshotStatus = SnapshotStatus.NotStarted;
			}
		});
	}

	// Remove this code when implement Update method and Replace baseline method.
	delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
}
