import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLicenseComponent } from 'src/app/components/modal/modal-license/modal-license.component';
import { LocalInfoService } from '../local-info/local-info.service';

@Injectable({
	providedIn: 'root'
})
export class LicensesService {

	constructor(
		public modalService: NgbModal,
		public localInfoService: LocalInfoService,
	) { }

	openLicensesAgreement(isCalledbyAbout?: boolean) {
		if (!isCalledbyAbout && this.modalService.hasOpenModals()) { return; }
		this.localInfoService.getLocalInfo().then(localInfo => {
			let fileName = this.checkLangName(localInfo.Lang);
			if (localInfo.GEO === 'cn' && localInfo.Lang === 'zh-hans') {
				fileName = 'zh-Hans-cn';
			}
			const agreementUrl = `assets/licenses/Agreement/${fileName}.html`;
			const licenseModalMetrics = {
				pageName: 'Page.Support.Article',
				pageContext: 'License agreement',
				closeButton: 'LicenseAgreementCloseButton',
			};
			const licenseModal: NgbModalRef = this.modalService.open(ModalLicenseComponent, {
				backdrop: true,
				size: 'lg',
				centered: true,
				ariaLabelledBy: 'license-agreement-dialog-basic-title',
				windowClass: 'license-Modal'
			});
			licenseModal.componentInstance.url = agreementUrl;
			licenseModal.componentInstance.type = 'html';
			licenseModal.componentInstance.licenseModalMetrics = licenseModalMetrics;
		});
	}

	openOpenSource(isCalledbyAbout?: boolean) {
		if (!isCalledbyAbout && this.modalService.hasOpenModals()) { return; }
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
			ariaLabelledBy: 'other-software-licenses-dialog-basic-title',
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
