import { Injectable } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import { ModalLicenseComponent } from 'src/app/components/modal/modal-license/modal-license.component';
import { LocalInfoService } from '../local-info/local-info.service';

@Injectable({
	providedIn: 'root',
})
export class LicensesService {
	constructor(
		public dialog: MatDialog,
		public localInfoService: LocalInfoService
	) { }

	openLicensesAgreement(isCalledbyAbout?: boolean) {
		if (!isCalledbyAbout && this.dialog.openDialogs.length) {
			return;
		}
		this.localInfoService.getLocalInfo().then((localInfo) => {
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
			const licenseModal = this.dialog.open(ModalLicenseComponent, {
				maxWidth: '50rem',
				autoFocus: true,
				hasBackdrop: true,
				disableClose: true,
				panelClass: 'license-Modal',
				ariaLabelledBy: 'license-agreement-dialog-basic-title',
			});
			licenseModal.componentInstance.url = agreementUrl;
			licenseModal.componentInstance.type = 'html';
			licenseModal.componentInstance.licenseModalMetrics = licenseModalMetrics;
		});
	}

	openOpenSource(isCalledbyAbout?: boolean) {
		if (!isCalledbyAbout && this.dialog.openDialogs.length) {
			return;
		}
		const openSourceUrl = `assets/licenses/OpenSource/OpenSourceLicenses.txt`;
		const licenseModalMetrics = {
			pageName: 'Page.Support.Article',
			pageContext: 'Other Software Licenses',
			closeButton: 'OtherSoftwareLicensesCloseButton',
		};
		const licenseModal = this.dialog.open(ModalLicenseComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'license-Modal',
			ariaLabelledBy: 'other-software-licenses-dialog-basic-title',
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
