import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalAboutComponent } from '../../modal/modal-about/modal-about.component';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
@Component({
	selector: 'vtr-widget-about',
	templateUrl: './widget-about.component.html',
	styleUrls: ['./widget-about.component.scss']
})
export class WidgetAboutComponent implements OnInit {

	lang = 'en';
	agreement = {
		'en': 'ILA_en-US',
		'zh-Hans': 'ILA_zh-CN',
	};
	buildVersion = environment.appVersion;
	shellVersion: string;


	constructor(
		public modalService: NgbModal,
		private translate: TranslateService,
	) { }

	ngOnInit() {
		if (this.translate.defaultLang) { this.lang = this.translate.defaultLang; }

		const win: any = window;
		if (win.Windows) {
			const packageVersion = win.Windows.ApplicationModel.Package.current.id.version;
			// packageVersion.major, packageVersion.minor, packageVersion.build, packageVersion.revision
			this.shellVersion = `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}`;
		}
	}

	agreementClicked() {
		const agreementUrl = `assets/licenses/Agreement/${this.agreement[this.lang]}.html`;
		const aboutModalMetrics = {
			pageName: 'Page.LicensesAgreement',
			pageContext: 'Licenses agreement',
			closeButton: 'LicensesAgreementCloseButton',
		};
		const aboutModal: NgbModalRef = this.modalService.open(ModalAboutComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'About-Modal'
		});
		aboutModal.componentInstance.url = agreementUrl;
		aboutModal.componentInstance.type = 'html';
		aboutModal.componentInstance.aboutModalMetrics = aboutModalMetrics;

	}

	openSourceClicked() {
		const openSourceUrl = `assets/licenses/OpenSource/OpenSourceLicenses.txt`;
		const aboutModalMetrics = {
			pageName: 'Page.OpenSourceLicenses',
			pageContext: 'Open Source Licenses',
			closeButton: 'OpenSourceLicensesCloseButton',
		};
		const aboutModal: NgbModalRef = this.modalService.open(ModalAboutComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'About-Modal'
		});
		aboutModal.componentInstance.url = openSourceUrl;
		aboutModal.componentInstance.type = 'txt';
		aboutModal.componentInstance.aboutModalMetrics = aboutModalMetrics;
	}

}
