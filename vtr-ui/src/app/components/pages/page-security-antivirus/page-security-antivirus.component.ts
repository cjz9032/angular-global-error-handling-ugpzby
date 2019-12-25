import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { AntiVirusViewModel } from '../../../data-models/security-advisor/antivirus.model';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { GuardService } from '../../../services/guard/guardService.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import * as phoenix from '@lenovo/tan-client-bridge';
import { AntivirusCommon } from 'src/app/data-models/security-advisor/antivirus-common.model';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { TranslateService } from '@ngx-translate/core';
import { AntivirusErrorHandle } from 'src/app/data-models/security-advisor/antivirus-error-handle.model';

@Component({
	selector: 'vtr-page-security-antivirus',
	templateUrl: './page-security-antivirus.component.html',
	styleUrls: ['./page-security-antivirus.component.scss']
})
export class PageSecurityAntivirusComponent implements OnInit, OnDestroy {
	backarrow = '< ';
	antiVirus: phoenix.Antivirus;
	viewModel: AntiVirusViewModel;
	urlPrivacyPolicy = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	urlTermsOfService = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	mcafeeArticleId: string;
	cardContentPositionA: any = {};
	securityAdvisor: phoenix.SecurityAdvisor;
	virus = 'security.antivirus.windowsDefender.virus';
	homeNetwork = 'security.antivirus.windowsDefender.homeNetwork';
	fireWall = 'security.antivirus.mcafee.firewall';
	register = 'security.antivirus.mcafee.register';
	virusScan = 'security.antivirus.mcafee.virusScan';
	antiSpam = 'security.antivirus.mcafee.antiSpam';
	quickClean = 'security.antivirus.mcafee.quickClean';
	vulnerability = 'security.antivirus.mcafee.vulnerability';
	backId = 'sa-av-btn-back';
	mcafeeArticleCategory: string;
	isOnline = true;
	notificationSubscription: Subscription;
	common: AntivirusCommon;

	@HostListener('window:focus')
	onFocus(): void {
		this.antiVirus.refresh();
	}

	constructor(
		public mockService: MockService,
		private vantageShell: VantageShellService,
		public cmsService: CMSService,
		public commonService: CommonService,
		public modalService: NgbModal,
		private guard: GuardService,
		private router: Router,
		private localInfoService: LocalInfoService,
		public translate: TranslateService,
	) {	}

	ngOnInit() {
		this.securityAdvisor = this.vantageShell.getSecurityAdvisor();
		this.securityAdvisor.antivirus.refresh();
		this.antiVirus = this.securityAdvisor.antivirus;
		this.fetchCMSArticles();
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		this.common = new AntivirusCommon(this.antiVirus, this.isOnline, this.localInfoService, this.translate);
		this.viewModel = new AntiVirusViewModel(this.antiVirus, this.commonService, this.translate);
		if (this.antiVirus.mcafee) {
			this.viewModel.mcafee = Object.assign({}, {
				localName: this.antiVirus.mcafee.localName,
				registered: this.antiVirus.mcafee.registered,
				subscription: this.antiVirus.mcafee.subscription,
				trialUrl: this.antiVirus.mcafee.trialUrl,
				enabled: this.antiVirus.mcafee.enabled,
				firewallStatus: this.antiVirus.mcafee.firewallStatus,
				status: this.antiVirus.mcafee.status,
				features: this.antiVirus.mcafee.features,
				expireAt: this.antiVirus.mcafee.expireAt,
				metrics: this.antiVirus.mcafee.metrics
			});
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.viewModel.mcafee);
			if (this.viewModel.mcafee.features) {
				this.viewModel.mcafeestatusList = this.getMcafeeFeature(this.viewModel.mcafee);
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.viewModel.mcafeestatusList);
			}
			if (this.viewModel.mcafee.metrics && this.viewModel.mcafee.metrics.length > 0) {
				this.viewModel.metricsList = this.getMcafeeMetric(this.viewModel.mcafee.metrics);
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeMetricList, this.viewModel.metricsList);
			} else {
				this.viewModel.showMetricsList = false;
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricList, false);
			}
		}
		if (this.antiVirus.windowsDefender) {
			this.viewModel.windowsDefender = this.antiVirus.windowsDefender;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefender, this.viewModel.windowsDefender);
			this.viewModel.windowsDefenderstatusList = [{
				status: this.viewModel.windowsDefender.status,
				title: this.virus,
			}, {
				status: this.viewModel.windowsDefender.firewallStatus,
				title: this.homeNetwork,
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
			} else { this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, null); }
		}
		if (this.antiVirus.mcafee || this.antiVirus.others || this.antiVirus.windowsDefender) {
			this.viewModel.antiVirusPage(this.antiVirus);
		}
		this.antiVirus.on(phoenix.EventTypes.avMcafeeFeaturesEvent, (data) => {
			this.viewModel.mcafeestatusList = this.getMcafeeFeature(this.viewModel.mcafee, data);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.viewModel.mcafeestatusList);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(phoenix.EventTypes.avOthersEvent, (data) => {
			if (data) {
				if (data.firewall && data.firewall.length > 0) {
					this.viewModel.otherFirewall = data.firewall[0];
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
				if (data.antiVirus && data.antiVirus.length > 0) {
					this.viewModel.otherAntiVirus = data.antiVirus[0];
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
		}).on(phoenix.EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			this.viewModel.windowsDefender.status = data;
			this.viewModel.windowsDefenderstatusList = [{
				status: this.viewModel.windowsDefender.status,
				title: this.virus,
			}, {
				status: this.viewModel.windowsDefender.firewallStatus,
				title: this.homeNetwork,
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.viewModel.windowsDefenderstatusList);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(phoenix.EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			this.viewModel.windowsDefender.firewallStatus = data;
			this.viewModel.windowsDefenderstatusList = [{
				status: this.viewModel.windowsDefender.status,
				title: this.virus,
			}, {
				status: this.viewModel.windowsDefender.firewallStatus,
				title: this.homeNetwork,
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.viewModel.windowsDefenderstatusList);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(phoenix.EventTypes.avMcafeeExpireAtEvent, (data) => {
			this.viewModel.mcafee.expireAt = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.viewModel.mcafee);
		}).on(phoenix.EventTypes.avMcafeeSubscriptionEvent, (data) => {
			this.viewModel.mcafee.subscription = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.viewModel.mcafee);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(phoenix.EventTypes.avMcafeeRegisteredEvent, (data) => {
			this.viewModel.mcafeestatusList = this.updateRegister(this.viewModel.mcafeestatusList, data);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.viewModel.mcafeestatusList);
			this.viewModel.antiVirusPage(this.antiVirus);
		}).on(phoenix.EventTypes.avMcafeeMetricsEvent, (data) => {
			this.viewModel.metricsList = this.getMcafeeMetric(this.viewModel.metricsList, data);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeMetricList, this.viewModel.metricsList);
		});

		if (!this.guard.previousPageName.startsWith('Security')) {
			this.antiVirus.refresh();
		}
		const antivirus = new AntivirusErrorHandle(this.antiVirus);
		antivirus.refreshAntivirus();
	}

	ngOnDestroy() {
		if (this.router.routerState.snapshot.url.indexOf('security') === -1) {
			if (this.securityAdvisor.wifiSecurity) {
				this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
			}
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'anti-virus',
			Template: 'inner-page-right-side-article-image-background'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
					this.mcafeeArticleId = this.cardContentPositionA.ActionLink;
					this.cmsService.fetchCMSArticle(this.mcafeeArticleId).then((r: any) => {
						if (r && r.Results && r.Results.Category) {
							this.mcafeeArticleCategory = r.Results.Category.map((category: any) => category.Title).join(' ');
						}
					});
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	openArticle() {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard: false,
			beforeDismiss: () => {
				if (articleDetailModal.componentInstance.onBeforeDismiss) {
					articleDetailModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});

		articleDetailModal.componentInstance.articleId = this.mcafeeArticleId;
	}

	getMcafeeFeature(mcafee: phoenix.McAfeeInfo, data?: Array<phoenix.McafeeFeature>) {
		const featureList = [{
			status: mcafee.registered,
			title: this.register,
			installed: true
		}];
		let list = mcafee.features;
		if (data) {
			list = data;
		}
		if (list.filter(e => e.id !== null).length > 1) {
			list.filter(e => e.id !== null).forEach((features) => {
				let status;
				let title;
				let installed;
				switch (features.id) {
					case 'vso': {
						status = features.value;
						title = this.virusScan;
						installed = features.installed;
						break;
					}
					case 'mpf': {
						status = features.value;
						title = this.fireWall;
						installed = features.installed;
						break;
					}
					case 'msk': {
						status = features.value;
						title = this.antiSpam;
						installed = features.installed;
						break;
					}
					case 'mqs': {
						status = features.value;
						title = this.quickClean;
						installed = features.installed;
						break;
					}
					case 'vul': {
						status = features.value;
						title = this.vulnerability;
						installed = features.installed;
						break;
					}
				}
				if (title) {
					featureList.push({
						status,
						title,
						installed
					});
				}
			});
		} else if (data) {
			if (data.length < 6) {
				featureList.push({
					status: data[0].value,
					title: this.virusScan,
					installed: data[0].installed
				});
				featureList.push({
					status: data[1].value,
					title: this.fireWall,
					installed: data[1].installed
				});
				featureList.push({
					status: null,
					title: this.antiSpam,
					installed: data[2].installed
				});
				featureList.push({
					status: null,
					title: this.quickClean,
					installed: data[3].installed
				});
				featureList.push({
					status: null,
					title: this.vulnerability,
					installed: data[4].installed
				});
			} else {
				featureList.push({
					status: data[0].value,
					title: this.virusScan,
					installed: data[0].installed
				});
				featureList.push({
					status: data[1].value,
					title: this.fireWall,
					installed: data[1].installed
				});
				featureList.push({
					status: null,
					title: this.antiSpam,
					installed: data[3].installed
				});
				featureList.push({
					status: null,
					title: this.quickClean,
					installed: data[4].installed
				});
				featureList.push({
					status: null,
					title: this.vulnerability,
					installed: data[5].installed
				});
			}
		} else {
			if (mcafee.features.length < 6) {
				featureList.push({
					status: mcafee.status,
					title: this.virusScan,
					installed: true
				});
				featureList.push({
					status: mcafee.firewallStatus,
					title: this.fireWall,
					installed: true
				});
				featureList.push({
					status: null,
					title: this.antiSpam,
					installed: mcafee.features[2].installed
				});
				featureList.push({
					status: null,
					title: this.quickClean,
					installed: mcafee.features[3].installed
				});
				featureList.push({
					status: null,
					title: this.vulnerability,
					installed: mcafee.features[4].installed
				});
			} else {
				featureList.push({
					status: mcafee.status,
					title: this.virusScan,
					installed: true
				});
				featureList.push({
					status: mcafee.firewallStatus,
					title: this.fireWall,
					installed: true
				});
				featureList.push({
					status: null,
					title: this.antiSpam,
					installed: mcafee.features[3].installed
				});
				featureList.push({
					status: null,
					title: this.quickClean,
					installed: mcafee.features[4].installed
				});
				featureList.push({
					status: null,
					title: this.vulnerability,
					installed: mcafee.features[5].installed
				});
			}
		}
		return featureList;
	}

	updateRegister(list: Array<any>, data) {
		this.viewModel.mcafee.registered = data;
		const registerList = {
			status: data ? 'enabled' : 'disabled',
			title: this.register
		};
		if (list.length > 0) {
			list.splice(0, 1, registerList);
		} else {
			list.push(registerList);
		}
		return list;
	}

	getMcafeeMetric(metrics: Array<phoenix.McafeeMetricsList>, data?) {
		const metricsList = [];
		const list = [];
		let metricsFeature = metrics;
		if (data) {
			metricsFeature = data;
		}
		if (metricsFeature.length === 0) {
			this.viewModel.showMetricsList = false;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricList, false);
		} else {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricList, true);
		}
		metricsFeature.forEach((e) => {
			let value;
			let id;
			switch (e.id) {
				case 2: {
					if (e.value > 1000000) {
						value = 1000000;
					} else { value = e.value; }
					id = 1;
					break;
				}
				case 1: {
					if (e.value > 1000000) {
						value = 1000000;
					} else { value = e.value; }
					id = 2;
					break;
				}
				case 4: {
					if (e.value > 1000000) {
						value = 1000000;
					} else { value = e.value; }
					id = 3;
					break;
				}
				case 6: {
					if (e.value > 1000000) {
						value = 1000000;
					} else { value = e.value; }
					id = 4;
					break;
				}
			}
			metricsList.push(
				{
					value,
					id
				}
			);
		});
		if (metricsFeature.length > 1) {
			for (let index = 1; index < 5; index++) {
				const metricsInfor = metricsList.find(e => e.id === index).value;
				list.push(metricsInfor);
			}
			if (list.filter(id => id > 0).length > 0) {
				this.viewModel.showMetricButton = false;
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricButton, false);
				return list;
			} else {
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricButton, true);
			}
		}
		return metricsList;
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}
}
