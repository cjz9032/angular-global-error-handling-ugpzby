import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLicenseComponent } from '../../modal/modal-license/modal-license.component';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';

declare var window;

@Component({
	selector: 'vtr-modal-about',
	templateUrl: './modal-about.component.html',
	styleUrls: ['./modal-about.component.scss']
})
export class ModalAboutComponent implements OnInit, AfterViewInit {

	lang = 'en';

	buildVersion = environment.appVersion;
	shellVersion: string;
	bridgeVersion: string;
	userGuide: any;
	constructor(
		public activeModal: NgbActiveModal,
		public modalService: NgbModal,
		private translate: TranslateService,
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
		if (this.translate.currentLang) { this.lang = this.translate.currentLang; }

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
		const useLang = this.checkLangName(this.lang);
		const agreementUrl = `assets/licenses/Agreement/${useLang}.html`;
		const licenseModalMetrics = {
			pageName: 'Page.Support.Article',
			pageContext: 'License agreement',
			closeButton: 'LicenseAgreementCloseButton',
		};
		const aboutModal: NgbModalRef = this.modalService.open(ModalLicenseComponent, {
			backdrop: true,
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
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'license-Modal'
		});
		aboutModal.componentInstance.url = openSourceUrl;
		aboutModal.componentInstance.type = 'txt';
		aboutModal.componentInstance.licenseModalMetrics = licenseModalMetrics;
		this.closeModal();
	}

	checkLangName(lang: string) {
		let useLang = lang.toLocaleLowerCase();
		switch (useLang) {
			case 'pt-br':
				useLang = 'pt-BR';
				break;
			case 'zh-hans':
				useLang = 'zh-Hans';
				break;
			case 'zh-hant':
				useLang = 'zh-Hant';
				break;
			case 'sr-latn':
				useLang = 'sr';
				break;
			default:
				break;
		}
		return useLang;
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
