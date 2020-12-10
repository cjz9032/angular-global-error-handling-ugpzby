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
	public snapshotStatusEnum = SnapshotStatus;
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
				// TBD. Something needed here?
			})
			.catch((error) => {
				// TBD. Something needed here?
			})
			.finally(() => {
				this.snapshotService.snapshotStatus = SnapshotStatus.snapshotCompleted;
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
			this.snapshotService.snapshotStatus = SnapshotStatus.baselineInProgress;
			// This is just to simulate a call on snapshotService
			this.snapshotService
				.getCurrentSnapshotInfo('')
				.then(async () => {
					//await this.delay(3000);
				})
				.finally(() => {
					this.snapshotService.snapshotStatus = SnapshotStatus.baselineCompleted;
				});
		});

		modalRef.componentInstance.modalClosing.subscribe((success) => {
			// Re-enabling the button, once the modal has been closed in a way
			// the user didn't started the Scan proccess.
			if (!success) {
				this.snapshotService.snapshotStatus = SnapshotStatus.notStarted;
			}
		});
	}

	public getSnapshotStatus() {
		return this.snapshotService.snapshotStatus;
	}

	public isButtonEnabled() {
		return (
			this.snapshotService.snapshotStatus === SnapshotStatus.notStarted ||
			this.snapshotService.snapshotStatus === SnapshotStatus.snapshotCompleted ||
			this.snapshotService.snapshotStatus === SnapshotStatus.baselineCompleted
		);
	}
}
