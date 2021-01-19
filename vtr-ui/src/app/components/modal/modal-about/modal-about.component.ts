import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LicensesService } from 'src/app/services/licenses/licenses.service';
import { MatDialogRef } from '@lenovo/material/dialog';

declare let window;

@Component({
	selector: 'vtr-modal-about',
	templateUrl: './modal-about.component.html',
	styleUrls: ['./modal-about.component.scss'],
})
export class ModalAboutComponent implements OnInit {
	buildVersion = environment.appVersion;
	shellVersion: string;
	bridgeVersion: string;
	userGuide: any;
	constructor(
		public dialogRef: MatDialogRef<ModalAboutComponent>,
		private licensesService: LicensesService,
		private shellService: VantageShellService,
		private commonService: CommonService
	) {
		this.userGuide = shellService.getUserGuide();
		if (this.userGuide) {
			this.userGuide.refresh();
		}
		this.commonService = commonService;
	}

	ngOnInit() {
		if (window.Windows) {
			const packageVersion = window.Windows.ApplicationModel.Package.current.id.version;
			// packageVersion.major, packageVersion.minor, packageVersion.build, packageVersion.revision
			this.shellVersion = `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}.${packageVersion.revision}`;
		}
		const jsBridgeVersion = this.shellService.getVersion();
		if (
			document.location.href.indexOf('stage') >= 0 ||
			document.location.href.indexOf('vantage.csw.') >= 0
		) {
			this.bridgeVersion = jsBridgeVersion ? jsBridgeVersion.split('-')[0] : '';
		} else {
			this.bridgeVersion = jsBridgeVersion ? jsBridgeVersion : '';
		}
	}

	agreementClicked() {
		this.licensesService.openLicensesAgreement(true);
		this.closeModal();
	}

	openSourceClicked() {
		this.licensesService.openOpenSource(true);
		this.closeModal();
	}

	launchUserGuide() {
		if (this.userGuide) {
			this.userGuide.launchUg(this.commonService.isOnline, true);
		}
	}

	closeModal() {
		this.dialogRef.close('close');
	}
}
