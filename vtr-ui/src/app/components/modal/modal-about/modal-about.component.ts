import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LicensesService } from 'src/app/services/licenses/licenses.service';

declare var window;

@Component({
	selector: 'vtr-modal-about',
	templateUrl: './modal-about.component.html',
	styleUrls: ['./modal-about.component.scss']
})
export class ModalAboutComponent implements OnInit, AfterViewInit {

	buildVersion = environment.appVersion;
	shellVersion: string;
	bridgeVersion: string;
	userGuide: any;
	constructor(
		public activeModal: NgbActiveModal,
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
		this.bridgeVersion = (jsBridgeVersion) ? jsBridgeVersion : '';
	}

	ngAfterViewInit() {
		setTimeout(() => { document.getElementById('about-dialog').parentElement.parentElement.parentElement.parentElement.focus(); }, 0);
	}

	agreementClicked() {
		this.licensesService.openLicensesAgreement();
		this.closeModal();
	}

	openSourceClicked() {
		this.licensesService.openOpenSource();
		this.closeModal();
	}

	launchUserGuide() {
		if (this.userGuide) {
			this.userGuide.launchUg(this.commonService.isOnline, true);
		}
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
