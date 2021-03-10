import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import { WinRT } from '@lenovo/tan-client-bridge';
import { TranslateService } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { ColorCalibrationEnum, ColorCalibrationInstallState } from 'src/app/enums/color-calibration.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { ColorCalibrationService } from 'src/app/services/smb/creator-centre/color-calibration.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-subpage-color-calibration',
	templateUrl: './subpage-color-calibration.component.html',
	styleUrls: ['./subpage-color-calibration.component.scss']
})

export class SubpageColorCalibrationComponent implements OnInit {

	ColorCalibrationInstallState = ColorCalibrationInstallState;
	installStatus = ColorCalibrationInstallState.Unknow;
	isOnline: boolean;
	errorMessage = undefined;
	clickedScreenshot: string;
	buttonLabel: string;
	buttonDisabled: boolean;
	installStarted: boolean;
	buttonMetricsItem: string;
	buttonLinkId: string;

	screenshotData = [{
		url: 'assets/images/smb/colorcalibration/screenshot1.jpg',
		metricsItem: 'ColorCalibrationScreenshot1',
	}, {
		url: 'assets/images/smb/colorcalibration/screenshot2.png',
		metricsItem: 'ColorCalibrationScreenshot2',
	},
	{
		url: 'assets/images/smb/colorcalibration/screenshot3.png',
		metricsItem: 'ColorCalibrationScreenshot3',
	}
	];


	@ViewChild('storeProfileDlg', { static: true }) storeProfileDlgView: TemplateRef<any>;
	@ViewChild('screenshotDlg', { static: true }) screenshotDlgView: TemplateRef<any>;


	constructor(private matDialog: MatDialog,
		private screenShotDlg: MatDialog,
		private shellService: VantageShellService,
		private colorCalibrationService: ColorCalibrationService,
		private commonService: CommonService,
		private translateService: TranslateService) {
		this.isOnline = true;
		this.installStarted = false;
	}

	ngOnInit(): void {
		this.installStatus = ColorCalibrationInstallState.Unknow;
		this.commonService.notification.subscribe(
			(response: AppNotification) => {
				this.onNotification(response);
			}
		);
		this.colorCalibrationService.getAppStatus(ColorCalibrationEnum.AppGUID);
	}

	onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					const currentOnline = notification.payload.isOnline;
					if (this.isOnline !== currentOnline) {
						this.isOnline = currentOnline;
						if (!currentOnline) {
							this.colorCalibrationService.cancelInstall();
						} else {
							this.colorCalibrationService.resetCancelInstall();
						}
						this.checkButtonEnable(this.installStatus);
					}
					break;
				case ColorCalibrationEnum.ActionInstallAppProgress:
					if (notification.payload < 85) {
						this.updateInstallStatus(ColorCalibrationInstallState.Downloading);
					} else {
						this.updateInstallStatus(ColorCalibrationInstallState.InstallerRunning);
					}
					break;
				case ColorCalibrationEnum.ActionInstallAppResult:
					this.updateInstallStatus(notification.payload);
					break;
				case ColorCalibrationEnum.ActionInstallationCancelled:
					this.colorCalibrationService.resetCancelInstall();
					break;
				case ColorCalibrationEnum.ActionGetAppStatusResult:
					this.updateInstallStatus(notification.payload);
					break;
				default:
					break;
			}
		}
	}

	processError(status) {
		if (status === ColorCalibrationInstallState.Downloading
			|| status === ColorCalibrationInstallState.InstallBefore
			|| status === ColorCalibrationInstallState.InstallDone
			|| status === ColorCalibrationInstallState.InstallerRunning
		) {
			this.errorMessage = undefined;
		} else if (status === ColorCalibrationInstallState.NotFinished) {
			if (this.installStarted) {
				this.errorMessage = this.translateService.instant(
					'appsForYou.common.errorMessage.installationFailed'
				);
			}
			else {
				this.errorMessage = undefined;
			}
		}
		else {
			this.errorMessage = this.translateService.instant(
				'appsForYou.common.errorMessage.installationFailed'
			);
		}
	}

	updateInstallStatus(status) {
		this.installStatus = status;
		this.processError(status);
		this.updateButtonLabel(status);
		this.checkButtonEnable(status);
		this.checkInstalling(status);
	}

	checkInstalling(status) {
		this.installStarted = (status === ColorCalibrationInstallState.Downloading
			|| status === ColorCalibrationInstallState.InstallerRunning);
	}

	async clickInstallButton() {
		switch (this.installStatus) {
			case ColorCalibrationInstallState.InstallBefore:
			case ColorCalibrationInstallState.InstallDone:
				this.isSupportUriProtocol().then(async (support) => {
					if (support) {
						//WinRT.launchUri('lenovo-color-calibration:vantage');
					} else {
						// If color calibration does not support launch by URL protocol, try to launch it by GCP
						const launchPath = await this.shellService.getSystemUpdate().getLaunchPath(
							ColorCalibrationEnum.AppGUID
						);
						if (launchPath) {
							const paths = launchPath.split('|');
							for (const path of paths) {
								const result = await this.shellService.getSystemUpdate().launchApp(path);
								if (result) {
									break;
								}
							}
						}
					}
				});
				this.installStarted = false;
				break;
			default:
				if (!this.installStarted) {
					this.errorMessage = undefined;
					this.installStarted = true;
					await this.colorCalibrationService.installApp(ColorCalibrationEnum.AppGUID);
				}
				break;
		}

	}

	private isSupportUriProtocol() {
		return new Promise((resovle) => {
			resovle(false);
		});
	}

	updateButtonLabel(status) {
		if (status === ColorCalibrationInstallState.InstallBefore
			|| status === ColorCalibrationInstallState.InstallDone) {
			this.buttonLabel = this.translateService.instant('appsForYou.appDetails.installButton.launch');
			this.buttonMetricsItem = 'button.lanuch';
			this.buttonLinkId = 'color-calibration-button-lanuch';
		}
		else if (status === ColorCalibrationInstallState.Downloading) {
			this.buttonLabel = this.translateService.instant('appsForYou.appDetails.installButton.downloading');
			this.buttonMetricsItem = 'button.downloading';
			this.buttonLinkId = 'color-calibration-button-downloading';
		}
		else if (status === ColorCalibrationInstallState.InstallerRunning) {
			this.buttonLabel = this.translateService.instant('appsForYou.appDetails.installButton.installing');
			this.buttonMetricsItem = 'button.installing';
			this.buttonLinkId = 'color-calibration-button-installing';
		}
		else {
			this.buttonLabel = this.translateService.instant('appsForYou.appDetails.installButton.install');
			this.buttonMetricsItem = 'button.install';
			this.buttonLinkId = 'color-calibration-button-install';
		}
	}

	checkButtonEnable(status) {
		this.buttonDisabled = this.isXRiteInstalling(status)
			|| (!this.isOnline && !this.isXRiteIntalled(status));
	}

	isXRiteInstalling(status) {
		return status === ColorCalibrationInstallState.Downloading
			|| status === ColorCalibrationInstallState.InstallerRunning;
	}

	isXRiteIntalled(status) {
		return status === ColorCalibrationInstallState.InstallBefore
			|| status === ColorCalibrationInstallState.InstallDone;
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

	openScreenshotDialog(imgUrl: string) {
		if (this.screenShotDlg.openDialogs.length) {
			return;
		}
		this.screenShotDlg.open(this.screenshotDlgView, {
			autoFocus: true,
			hasBackdrop: true,
			disableClose: false,
			panelClass: 'color-calibration-screenshot-dialog'
		});
		this.clickedScreenshot = imgUrl;
	}

	closeScreenshotDialog() {
		this.screenShotDlg.closeAll();
	}
}
