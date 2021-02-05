import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@lenovo/material/dialog';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { AppDetails } from 'src/app/services/apps-for-you/apps-for-you.service';
import { DownloadButtonStatusEnum } from 'src/app/services/modern-preload/modern-preload.service';

@Component({
	selector: 'vtr-subpage-color-calibration',
	templateUrl: './subpage-color-calibration.component.html',
	styleUrls: ['./subpage-color-calibration.component.scss']
})
export class SubpageColorCalibrationComponent implements OnInit {

	appDetails: AppDetails;
	readonly DownloadState = {
		NOT_INSTALL: 1,
		INSTALLED: 2,
		DOWNLOADING: 3,
		DOWNLOAD_COMPLETE: 4,
		INSTALLING: 5,
		FAILED_INSTALL: -1,
	};

	readonly InstallState = {
		INSTALL: 1,
		DOWNLOADING: 2,
		INSTALLING: 3,
		LAUNCH: 4,
		SEEMORE: 5,
		UNKNOWN: -1,
	};

	downloadStatus = this.DownloadState.NOT_INSTALL;
	installStatus = this.InstallState.INSTALL;
	isOnline: boolean;
	errorMessage = '';
	showArrows: boolean;
	//@Input() bigScreenshot: string;


	@ViewChild('storeProfileDlg', { static: true }) storeProfileDlgView: TemplateRef<any>;
	@ViewChild('screenshotDlg', { static: true }) screenshotDlgView: TemplateRef<any>;


	constructor(private matDialog: MatDialog,
		private screenShotDlg: MatDialog) {
		this.isOnline = true;
	}

	ngOnInit(): void {
	}

	clickInstallButton() {


	}

	getInstallButtonLabel(installStatus) {
		return 'Install';
	}


	getMetricsItem(installStatus) {

	}

	getLinkID(installStatus) {

	}

	openRestoreProfileModal() {

	}

	onRestoreProfileClick() {
		const modal = this.matDialog.open(this.storeProfileDlgView, {

			autoFocus: true,
			hasBackdrop: true,
			disableClose: false,
			panelClass: 'restore-profile-dialog',
		});

		modal.afterClosed()
			.subscribe(() => {
				this.matDialog.closeAll();
			});
	}

	closeRestoreProfileModal() {
		this.matDialog.closeAll();
	}

	shouldFocusScreenshot(position: number) {
		return position >= 1 && position <= 3;
	}


	openScreenshotDialog(imgUrl: string) {
		if (this.screenShotDlg.openDialogs.length) {
			return;
		}
		const screenshotModal = this.screenShotDlg.open(this.screenshotDlgView, {
			autoFocus: false,
			hasBackdrop: false,
			panelClass: 'color-calibration-screenshot-dialog'
		});
		screenshotModal.componentInstance.bigScreenshot = imgUrl;
	}

	closeScreenshotDialog() {
		this.screenShotDlg.closeAll();
	}
}
