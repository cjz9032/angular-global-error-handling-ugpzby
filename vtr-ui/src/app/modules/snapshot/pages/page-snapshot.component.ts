import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { ContentActionType } from 'src/app/enums/content.enum';
import { SnapshotService } from 'src/app/modules/snapshot/services/snapshot.service';
import { SnapshotStatus } from '../enums/snapshot.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { WindowsVersionService } from 'src/app/services/windows-version/windows-version.service';

@Component({
	selector: 'vtr-page-snapshot',
	templateUrl: './page-snapshot.component.html',
	styleUrls: ['./page-snapshot.component.scss'],
})
export class PageSnapshotComponent implements OnInit, OnDestroy {
	snapshotSupportCard: FeatureContent = new FeatureContent();

	constructor(
		private translate: TranslateService,
		private commonService: CommonService,
		private snapshotService: SnapshotService,
		private loggerService: LoggerService,
		private windowsVerisonService: WindowsVersionService
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
			this.snapshotService.snapshotStatus = SnapshotStatus.fullSnapshotInProgress;

			const componentSnapshotPromises = [];

			this.snapshotService.getAllComponentsList().forEach((key) => {
				componentSnapshotPromises.push(this.snapshotService.getCurrentSnapshotInfo(key));
			});

			Promise.all(componentSnapshotPromises)
				.then(() => {
					this.loggerService.info('Success on all promises');
				})
				.catch((error) => {
					this.loggerService.error(`Failure requesting snapshot data: ${error}`);
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
		Object.assign(this.snapshotSupportCard, {
			Id: 'Snapshot.DiagnosticsTools',
			Title: this.translate.instant('hardwareScan.support.title'),
			FeatureImage: this.windowsVerisonService.isNewerThanRS4()
				? 'assets/images/support.webp'
				: 'assets/images/support.jpg',
			Action: 'Read More',
			ActionType: ContentActionType.External,
			ActionLink: 'https://pcsupport.lenovo.com/lenovodiagnosticsolutions/downloads',
			isLocal: true,
		});
		if (!this.commonService.isOnline) {
			this.snapshotSupportCard.Title = this.translate.instant('hardwareScan.offline');
		}
	}
}
