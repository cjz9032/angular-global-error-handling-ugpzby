import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ModalLicenseComponent } from 'src/app/components/modal/modal-license/modal-license.component';

@Injectable({
	providedIn: 'root'
})
export class LicensesService {

	lang = 'en';

	constructor(
		private translate: TranslateService,
		public modalService: NgbModal,
	) { }

	openLicensesAgreement() {
		if (this.translate.currentLang) { this.lang = this.translate.currentLang; }
		const useLang = this.checkLangName(this.lang);
		const agreementUrl = `assets/licenses/Agreement/${useLang}.html`;
		const licenseModalMetrics = {
			pageName: 'Page.Support.Article',
			pageContext: 'License agreement',
			closeButton: 'LicenseAgreementCloseButton',
		};
		const licenseModal: NgbModalRef = this.modalService.open(ModalLicenseComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'license-Modal'
		});
		licenseModal.componentInstance.url = agreementUrl;
		licenseModal.componentInstance.type = 'html';
		licenseModal.componentInstance.licenseModalMetrics = licenseModalMetrics;
	}

	openOpenSource() {
		const openSourceUrl = `assets/licenses/OpenSource/OpenSourceLicenses.txt`;
		const licenseModalMetrics = {
			pageName: 'Page.Support.Article',
			pageContext: 'Other Software Licenses',
			closeButton: 'OtherSoftwareLicensesCloseButton',
		};
		const licenseModal: NgbModalRef = this.modalService.open(ModalLicenseComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'license-Modal'
		});
		licenseModal.componentInstance.url = openSourceUrl;
		licenseModal.componentInstance.type = 'txt';
		licenseModal.componentInstance.licenseModalMetrics = licenseModalMetrics;
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
}
