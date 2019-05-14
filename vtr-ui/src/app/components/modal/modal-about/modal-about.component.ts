import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLicenseComponent } from '../../modal/modal-license/modal-license.component';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

declare var Windows;
@Component({
	selector: 'vtr-modal-about',
	templateUrl: './modal-about.component.html',
	styleUrls: ['./modal-about.component.scss']
})
export class ModalAboutComponent implements OnInit, AfterViewInit {

	lang = 'en';

	buildVersion = environment.appVersion;
	shellVersion: string;
	constructor(
		public activeModal: NgbActiveModal,
		public modalService: NgbModal,
		private translate: TranslateService,
		private shellService: VantageShellService,
	) { }

	ngOnInit() {
		if (this.translate.currentLang) { this.lang = this.translate.currentLang; }

		if (Windows) {
			const packageVersion = Windows.ApplicationModel.Package.current.id.version;
			// packageVersion.major, packageVersion.minor, packageVersion.build, packageVersion.revision
			this.shellVersion = `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}`;
		}
	}

	ngAfterViewInit() {
		setTimeout(() => { document.getElementById('about-dialog').parentElement.parentElement.parentElement.parentElement.focus(); }, 0);
	}

	agreementClicked() {
		const agreementUrl = `assets/licenses/Agreement/${this.lang}.html`;
		const licenseModalMetrics = {
			pageName: 'Page.Support.Article',
			pageContext: 'License agreement',
			closeButton: 'LicenseAgreementCloseButton',
		};
		const aboutModal: NgbModalRef = this.modalService.open(ModalLicenseComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'license-Modal'
		});
		aboutModal.componentInstance.url = agreementUrl;
		aboutModal.componentInstance.type = 'html';
		aboutModal.componentInstance.licenseModalMetrics = licenseModalMetrics;
		this.closeModal();
	}

	openSourceClicked() {
		const openSourceUrl = `assets/licenses/OpenSource/OpenSourceLicenses.txt`;
		const licenseModalMetrics = {
			pageName: 'Page.Support.Article',
			pageContext: 'Other Software Licenses',
			closeButton: 'OtherSoftwareLicensesCloseButton',
		};
		const aboutModal: NgbModalRef = this.modalService.open(ModalLicenseComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'license-Modal'
		});
		aboutModal.componentInstance.url = openSourceUrl;
		aboutModal.componentInstance.type = 'txt';
		aboutModal.componentInstance.licenseModalMetrics = licenseModalMetrics;
		this.closeModal();
	}

	launchUserGuide() {
		this.shellService.launchUserGuide(true);
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
