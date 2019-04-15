import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AntiVirusviewModel } from 'src/app/data-models/security-advisor/antivirus.model';
import { Antivirus, SecurityAdvisor, EventTypes } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-page-security-antivirus',
	templateUrl: './page-security-antivirus.component.html',
	styleUrls: ['./page-security-antivirus.component.scss']
})
export class PageSecurityAntivirusComponent implements OnInit {

	title = 'security.antivirus.common.title' ;
	back = 'security.antivirus.common.back';
	backarrow = '< ';
	antiVirus: Antivirus;
	viewModel: any;
	urlPrivacyPolicy = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	urlTermsOfService = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	urlGetMcAfee = '25CAD7D97D59483381EA39A87685A3C7';
	cardContentPositionA: any;
	securityAdvisor: SecurityAdvisor;
	virusScan = 'security.antivirus.common.virusScan';
	fireWall = 'security.antivirus.common.firewall';
	enablevirus = 'security.antivirus.common.enableVirusScan';
	enableFirewall = 'security.antivirus.common.enableFirewall';

	@HostListener('window:focus')
	onFocus(): void {
		this.antiVirus.refresh();
	}

	constructor(public mockService: MockService,
		public VantageShell: VantageShellService,
		public cmsService: CMSService,
		public commonService: CommonService,
		public modalService: NgbModal) {
		this.securityAdvisor = this.VantageShell.getSecurityAdvisor();
		this.antiVirus = this.VantageShell.getSecurityAdvisor().antivirus;
		console.log(this.antiVirus);
		this.viewModel = new AntiVirusviewModel(this.antiVirus, commonService);
		this.fetchCMSArticles();
	}

	ngOnInit() {
		if (this.antiVirus.mcafee) {
			this.viewModel.mcafee = this.antiVirus.mcafee;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.viewModel.mcafee);
			this.viewModel.mcafeestatusList = [{
				buttonClick: this.viewModel.mcafee.launch.bind(this.viewModel.mcafee),
				status: this.viewModel.mcafee.status,
				title: this.virusScan,
				buttonTitle: this.enablevirus,
				metricsItem: 'launchMcafee',
			}, {
				buttonClick: this.viewModel.mcafee.launch.bind(this.viewModel.mcafee),
				status: this.viewModel.mcafee.firewallStatus,
				title: this.fireWall,
				buttonTitle: this.enableFirewall,
				metricsItem: 'launchMcafee',
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.viewModel.mcafeestatusList);
		}
		if (this.antiVirus.windowsDefender) {
			this.viewModel.windowsDefender = this.antiVirus.windowsDefender;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefender, this.viewModel.windowsDefender);
			this.viewModel.windowsDefenderstatusList = [{
				status: this.viewModel.windowsDefender.status,
				title: this.virusScan,
			}, {
				status: this.viewModel.windowsDefender.firewallStatus,
				title: this.fireWall,
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.viewModel.windowsDefenderstatusList);
		}
		if (this.antiVirus.others) {
			if (this.antiVirus.others.firewall && this.antiVirus.others.firewall.length > 0) {
				this.viewModel.otherFirewall = this.antiVirus.others.firewall[0];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherFirewall, this.viewModel.otherFirewall);
				this.viewModel.othersFirewallstatusList = [{
					status: this.viewModel.otherFirewall.status,
					title: this.fireWall,
				}];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, this.viewModel.othersFirewallstatusList);
			} else { this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, null); }
			if (this.antiVirus.others.antiVirus && this.antiVirus.others.antiVirus.length > 0) {
				this.viewModel.otherAntiVirus = this.antiVirus.others.antiVirus[0];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherAntiVirus, this.viewModel.otherAntiVirus);
				this.viewModel.othersAntistatusList = [{
					status: this.viewModel.otherAntiVirus.status,
					title: this.virusScan,
				}];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, this.viewModel.othersAntistatusList);
			} else {this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, null); }
		}
		if (this.antiVirus.mcafee || this.antiVirus.others || this.antiVirus.windowsDefender) {
			this.viewModel.antiVirusPage(this.antiVirus);
		}
		console.log(this.viewModel.otherFirewall);
		this.antiVirus.on(EventTypes.avMcafeeStatusEvent, (data) => {
			this.viewModel.mcafee.launch = this.antiVirus.mcafee.launch.bind(this.antiVirus.mcafee);
			this.viewModel.mcafee.status = data;
			this.viewModel.mcafeestatusList = [{
				buttonClick: this.viewModel.mcafee.launch.bind(this.viewModel.mcafee),
				status: this.viewModel.mcafee.status,
				title: this.virusScan,
				buttonTitle: this.enablevirus,
			}, {
				buttonClick: this.viewModel.mcafee.launch.bind(this.viewModel.mcafee),
				status: this.viewModel.mcafee.firewallStatus,
				title: this.fireWall,
				buttonTitle: this.enableFirewall,
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.viewModel.mcafeestatusList);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(EventTypes.avMcafeeFirewallStatusEvent, (data) => {
			this.viewModel.mcafee.launch = this.antiVirus.mcafee.launch.bind(this.antiVirus.mcafee);
			this.viewModel.mcafee.firewallStatus = data;
			this.viewModel.mcafeestatusList = [{
				buttonClick: this.viewModel.mcafee.launch.bind(this.viewModel.mcafee),
				status: this.viewModel.mcafee.status,
				title: this.virusScan,
				buttonTitle: this.enablevirus,
			}, {
				buttonClick: this.viewModel.mcafee.launch.bind(this.viewModel.mcafee),
				status: this.viewModel.mcafee.firewallStatus,
				title: this.fireWall,
				buttonTitle: this.enableFirewall,
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.viewModel.mcafeestatusList);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(EventTypes.avOthersEvent, () => {
			if (this.antiVirus.others) {
				if (this.antiVirus.others.firewall && this.antiVirus.others.firewall.length > 0) {
					this.viewModel.otherFirewall = this.antiVirus.others.firewall[0];
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherFirewall, this.viewModel.otherFirewall);
					this.viewModel.othersFirewallstatusList = [{
						status: this.viewModel.otherFirewall.status,
						title: this.fireWall,
					}];
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, this.viewModel.othersFirewallstatusList);
				} else {
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, null);
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherFirewall, null);
				}
				if (this.antiVirus.others.antiVirus && this.antiVirus.others.antiVirus.length > 0) {
					this.viewModel.otherAntiVirus = this.antiVirus.others.antiVirus[0];
					this.viewModel.othersAntistatusList = [{
						status: this.viewModel.otherAntiVirus.status,
						title: this.virusScan,
					}];
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, this.viewModel.othersAntistatusList);
				} else {
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, null);
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherAntiVirus, null);
				}
			}
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			this.viewModel.windowsDefender.status = data ;
			this.viewModel.windowsDefenderstatusList = [{
				status: this.viewModel.windowsDefender.status,
				title: this.virusScan,
			}, {
				status: this.viewModel.windowsDefender.firewallStatus,
				title: this.fireWall,
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.viewModel.windowsDefenderstatusList);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			this.viewModel.windowsDefender.firewallStatus = data;
			this.viewModel.windowsDefenderstatusList = [{
				status: this.viewModel.windowsDefender.status,
				title: this.virusScan,
			}, {
				status: this.viewModel.windowsDefender.firewallStatus,
				title: this.fireWall,
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.viewModel.windowsDefenderstatusList);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(EventTypes.avMcafeeExpireAtEvent, (data) => {
			this.viewModel.mcafee.expireAt = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.viewModel.mcafee);
		}).on(EventTypes.avMcafeeSubscriptionEvent, (data) => {
			this.viewModel.mcafee.subscription = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.viewModel.mcafee);
		});
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'anti-virus',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];

				this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	openArticle() {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal'
		});

		articleDetailModal.componentInstance.articleId = this.urlGetMcAfee;
	}
}
