import { Component, OnInit, HostListener } from '@angular/core';
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
export class ModalAboutComponent implements OnInit {

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
		if (document.location.href.indexOf('stage') >= 0
		|| document.location.href.indexOf('vantage.csw.') >= 0
		&& (jsBridgeVersion && jsBridgeVersion.indexOf('-') >= 0)) {
			this.bridgeVersion = jsBridgeVersion.split('-')[0];
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
		this.activeModal.close('close');
	}

	initModalFocus() {
		(document.querySelector('.About-Modal') as HTMLElement).focus();
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.initModalFocus();
	}
}
