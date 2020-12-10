import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { ContentActionType } from 'src/app/enums/content.enum';
import { SnapshotService } from 'src/app/modules/snapshot/services/snapshot.service';
import { SnapshotStatus } from '../enums/snapshot.enum';

@Component({
	selector: 'vtr-page-snapshot',
	templateUrl: './page-snapshot.component.html',
	styleUrls: ['./page-snapshot.component.scss'],
})
export class PageSnapshotComponent implements OnInit, OnDestroy {
	hardwareScanSupportCard: FeatureContent = new FeatureContent();

	constructor(
		private translate: TranslateService,
		private commonService: CommonService,
		private snapshotService: SnapshotService
	) {}

	ngOnInit(): void {
		this.initSupportCard();
		this.initializeSnapshots();
	}

	ngOnDestroy(): void {}

	private initializeSnapshots() {
		if (
			this.snapshotService.snapshotStatus === SnapshotStatus.snapshotCompleted ||
			this.snapshotService.snapshotStatus === SnapshotStatus.baselineCompleted
		) {
			// If a snapshot/baseline was finished while I'm not on snapshot page, I'll reset it to initial state
			this.snapshotService.snapshotStatus = SnapshotStatus.notStarted;
		} else if (this.snapshotService.snapshotStatus === SnapshotStatus.firstLoad) {
			// If it is the first time I'm on this page, initialize it with the first snapshot
			this.snapshotService.snapshotStatus = SnapshotStatus.snapshotInProgress;

			const componentSnapshotPromises = [];
			this.snapshotService.getSoftwareComponentsList().forEach((key) => {
				componentSnapshotPromises.push(this.snapshotService.getCurrentSnapshotInfo(key));
			});

			this.snapshotService.getHardwareComponentsList().forEach((key) => {
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
	}

	// TODO: This function was copied from Page HWScan.
	// Look for a way to move this function to a common place (maybe a service)
	// in order to allow HWScan and Snapshot to use it, but without creating an undesired dependency between them.
	private initSupportCard() {
		Object.assign(this.hardwareScanSupportCard, {
			Id: 'HardwareScan.DiagnosticsTools',
			Title: this.translate.instant('hardwareScan.support.title'),
			FeatureImage: 'assets/images/support.jpg',
			Action: 'Read More',
			ActionType: ContentActionType.External,
			ActionLink: 'https://pcsupport.lenovo.com/lenovodiagnosticsolutions/downloads',
			isLocal: true,
		});
		if (!this.commonService.isOnline) {
			this.hardwareScanSupportCard.Title = this.translate.instant('hardwareScan.offline');
		}
	}
}
