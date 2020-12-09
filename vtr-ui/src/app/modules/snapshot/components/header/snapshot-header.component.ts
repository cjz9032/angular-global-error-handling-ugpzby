import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	SnapshotHardwareComponents,
	SnapshotSoftwareComponents,
	SnapshotStatus,
} from 'src/app/modules/snapshot/enums/snapshot.enum';
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
	@Input() snapshotStatus: SnapshotStatus = this.snapshotService.snapshotStatus;

	public showSnapshotInformation = true;
	public snapshotInfo: any = {};
	constructor(private snapshotService: SnapshotService, private modalService: NgbModal) {
		this.snapshotInfo = {
			hardwareList: this.snapshotService.getHardwareComponentsList(),
			softwareList: this.snapshotService.getSoftwareComponentsList(),
		};
	}

	ngOnInit() {}

	onTakeSnapshot() {
		this.showSnapshotInformation = false;
		this.disableSnapshotButton = true;
		this.disableBaselineButton = true;
		this.snapshotService.snapshotStatus = SnapshotStatus.snapshotInProgress;

		// Quick implementation, just for test
		const componentSnapshotPromises = [];

		SnapshotSoftwareComponents.values().forEach((key) => {
			componentSnapshotPromises.push(this.snapshotService.getCurrentSnapshotInfo(key));
		});

		SnapshotHardwareComponents.values().forEach((key) => {
			componentSnapshotPromises.push(this.snapshotService.getCurrentSnapshotInfo(key));
		});

		Promise.all(componentSnapshotPromises)
			.then(() => {
				// TBD
			})
			.catch((error) => {
				// TBD
			})
			.finally(() => {
				this.snapshotService.snapshotStatus = SnapshotStatus.snapshotCompleted;
				// unlock buttons
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
			this.snapshotStatus = SnapshotStatus.baselineInProgress;
			// This is just to simulate a call on snapshotService
			this.snapshotService
				.getCurrentSnapshotInfo('')
				.then(async () => {
					await this.delay(3000);
				})
				.finally(() => {
					this.disableSnapshotButton = false;
					this.disableBaselineButton = false;
					this.snapshotStatus = SnapshotStatus.baselineCompleted;
				});
		});

		modalRef.componentInstance.modalClosing.subscribe((success) => {
			// Re-enabling the button, once the modal has been closed in a way
			// the user didn't started the Scan proccess.
			if (!success) {
				this.disableSnapshotButton = false;
				this.disableBaselineButton = false;
				this.snapshotStatus = SnapshotStatus.notStarted;
			}
		});
	}

	// Remove this code when implement Update method and Replace baseline method.
	delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
