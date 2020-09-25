import { Antivirus, McAfeeInfo, WindowsDefender, OtherInfo, EventTypes, McafeeMetricsList, McafeeFeature } from '@lenovo/tan-client-bridge';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { AntivirusService } from 'src/app/services/security/antivirus.service';
import { AntivirusCommonData } from './antivirus-common.data.model';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

export class AntiVirusViewModel {
	currentPage = 'windows';
	mcafeeInstall: boolean;
	mcafee: McAfeeInfo = {
		localName: 'McAfee LiveSafe',
		subscription: 'unknown',
		expireAt: 30,
		registered: false,
		trialUrl: 'unknown',
		features: [],
		firewallStatus: false,
		status: false,
		enabled: false,
		metrics: [],
		additionalCapabilities: '',
	};
	windowsDefender: WindowsDefender = {
		firewallStatus: undefined,
		status: undefined,
		enabled: false
	};
	otherAntiVirus: OtherInfo = {
		status: false,
		name: 'security.antivirus.others.unknown',
	};
	metricsList: Array<any> = [];
	otherFirewall: OtherInfo;
	mcafeestatusList: Array<any> = [];
	windowsDefenderstatusList: Array<any> = [{
		status: 'loading',
		title: 'security.antivirus.windowsDefender.virus',
		type: 'antivirus'
	}, {
		status: 'loading',
		title: 'security.antivirus.windowsDefender.homeNetwork',
		type: 'firewall'
	}];
	othersAntistatusList: Array<any> = [];
	othersFirewallstatusList: Array<any> = [];
	showMetricsList = true;
	showMetricButton = true;
	showMcafee = true;

	partyAvList = ['DeepArmor Endpoint Protection', 'DeepArmor Small Business'];
	virus = 'security.antivirus.windowsDefender.virus';
	homeNetwork = 'security.antivirus.windowsDefender.homeNetwork';
	fireWall = 'security.antivirus.mcafee.firewall';
	register = 'security.antivirus.mcafee.register';
	virusScan = 'security.antivirus.mcafee.virusScan';
	antiSpam = 'security.antivirus.mcafee.antiSpam';
	quickClean = 'security.antivirus.mcafee.quickClean';
	vulnerability = 'security.antivirus.mcafee.vulnerability';

	constructor(
		public antiVirus: Antivirus,
		private localCacheService: LocalCacheService,
		public translate: TranslateService,
		public antivirusService: AntivirusService) {
		translate.stream(this.otherAntiVirus.name).subscribe((res) => {
			this.otherAntiVirus.name = res;
		});

		this.windowsDefenderstatusList.forEach(element => this.waitTimeout(element.type));

		this.readCache();
		this.updateCommonInfo();
		this.updateOthersAntivirus(antiVirus.others);
		this.updateMcAfeeInfo();
		this.updateWindowsDefender();
		this.addEventListener();
	}

	private readCache() {
		const cacheMcafeeStatusList = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityMcAfeeStatusList);
		if (cacheMcafeeStatusList) {
			this.mcafeestatusList = cacheMcafeeStatusList;
		}

		const cacheMcafeeMetricsList = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityMcAfeeMetricList);
		if (cacheMcafeeMetricsList) {
			this.metricsList = cacheMcafeeMetricsList;
		}

		const cacheShowMetricButton = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityShowMetricButton);
		if (typeof cacheShowMetricButton === 'boolean') {
			this.showMetricButton = cacheShowMetricButton;
		}

		const cacheShowMetricList = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityShowMetricList);
		if (typeof cacheShowMetricList === 'boolean') {
			this.showMetricsList = cacheShowMetricList;
		}

		const cacheShowMcafee = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityShowMcafee);
		if (typeof cacheShowMcafee === 'boolean') {
			this.showMcafee = cacheShowMcafee;
		}

		const cacheWindowsList = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityWindowsDefenderStatusList);
		if (cacheWindowsList) {
			this.windowsDefenderstatusList = cacheWindowsList;
		}

		const cacheOtherAntiVirusList = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityOthersAntiStatusList);
		if (cacheOtherAntiVirusList) {
			this.othersAntistatusList = cacheOtherAntiVirusList;
		}
		const cacheOtherFirewallList = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityOthersFirewallStatusList);
		if (cacheOtherFirewallList) {
			this.othersFirewallstatusList = cacheOtherFirewallList;
		}

		const cacheOtherAntiVirus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityOtherAntiVirus);
		if (cacheOtherAntiVirus) {
			this.otherAntiVirus = cacheOtherAntiVirus;
		}
		const cacheOtherFirewall = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityOtherFirewall);
		if (cacheOtherFirewall) {
			this.otherFirewall = cacheOtherFirewall;
		}

		const cacheMcafee = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityMcAfee);
		if (cacheMcafee) {
			this.mcafee = cacheMcafee;
		}
	}

	private addEventListener() {
		this.antiVirus.on(EventTypes.avMcafeeFeaturesEvent, (data) => {
			this.mcafeestatusList = this.getMcafeeFeature(this.mcafee, data);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfeeStatusList, this.mcafeestatusList);
			this.updateCommonInfo();
		}).on(EventTypes.avOthersEvent, (data) => {
			this.updateOthersAntivirus(data);
			this.updateCommonInfo();
		}).on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			this.windowsDefender.status = data;
			this.setDefenderStatus(this.windowsDefender.status,
				this.windowsDefender.firewallStatus,
				this.currentPage)
			this.updateCommonInfo();
		}).on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			this.windowsDefender.firewallStatus = data;
			this.setDefenderStatus(this.windowsDefender.status,
				this.windowsDefender.firewallStatus,
				this.currentPage)
			this.updateCommonInfo();
		}).on(EventTypes.avMcafeeExpireAtEvent, (data) => {
			this.mcafee.expireAt = data;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
		}).on(EventTypes.avMcafeeSubscriptionEvent, (data) => {
			this.mcafee.subscription = data.toLowerCase();
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
			this.updateCommonInfo();
		}).on(EventTypes.avMcafeeRegisteredEvent, (data) => {
			this.mcafeestatusList = this.updateRegister(this.mcafeestatusList, data);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfeeStatusList, this.mcafeestatusList);
			this.updateCommonInfo();
		}).on(EventTypes.avMcafeeMetricsEvent, (data) => {
			this.metricsList = this.getMcafeeMetric(this.metricsList, data);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfeeMetricList, this.metricsList);
		}).on(EventTypes.avMcafeeTrialUrlEvent, (data) => {
			this.mcafee.trialUrl = data;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfeeTrialUrl, this.mcafee.trialUrl);
		}).on(EventTypes.avStartRefreshEvent, () => {
			if (this.currentPage === 'windows') {
				this.windowsDefenderstatusList.forEach(element => {
					if(element.status === 'failedLoad') {
						element.status = 'loading';
						this.waitTimeout(element.type);
					}
				});
			}
		});
	}

	private updateCommonInfo() {
		this.setAntivirusPageUI(this.antivirusService.GetAntivirusStatus());
	}

	private setAntivirusPageUI (antivirusCommonData: AntivirusCommonData) {
		this.currentPage = antivirusCommonData.currentPage;
		this.mcafeeInstall = antivirusCommonData.isMcAfeeInstalled;
	}

	private updateWindowsDefender() {
		if (this.antiVirus.windowsDefender) {
			this.windowsDefender = this.antiVirus.windowsDefender;
		}

		if (this.windowsDefender) {
			this.setDefenderStatus(this.windowsDefender.status,
				this.windowsDefender.firewallStatus,
				this.currentPage)
		}
	}

	private updateMcAfeeInfo() {
		if (!this.antiVirus.mcafee) return;

		this.mcafee = Object.assign({}, {
			localName: this.antiVirus.mcafee.localName,
			registered: this.antiVirus.mcafee.registered,
			subscription: this.antiVirus.mcafee.subscription.toLowerCase(),
			trialUrl: this.antiVirus.mcafee.trialUrl,
			enabled: this.antiVirus.mcafee.enabled,
			firewallStatus: this.antiVirus.mcafee.firewallStatus,
			status: this.antiVirus.mcafee.status,
			features: this.antiVirus.mcafee.features,
			expireAt: this.antiVirus.mcafee.expireAt,
			metrics: this.antiVirus.mcafee.metrics,
			additionalCapabilities: this.antiVirus.mcafee.additionalCapabilities,
		});
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
		if (this.mcafee.features) {
			this.mcafeestatusList = this.getMcafeeFeature(this.mcafee);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfeeStatusList, this.mcafeestatusList);
		}
		if (this.mcafee.metrics && this.mcafee.metrics.length > 0) {
			this.metricsList = this.getMcafeeMetric(this.mcafee.metrics);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityMcAfeeMetricList, this.metricsList);
		} else {
			this.showMetricsList = false;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowMetricList, false);
		}
	}

	private updateOthersAntivirus(data) {
		if (!data) return;

		if (data.firewall && data.firewall.length > 0) {
			this.otherFirewall = data.firewall[0];
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityOtherFirewall, this.otherFirewall);
			this.othersFirewallstatusList = [{
				status: this.otherFirewall.status,
				title: this.fireWall,
			}];
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityOthersFirewallStatusList, this.othersFirewallstatusList);
		} else {
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityOthersFirewallStatusList, null);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityOtherFirewall, null);
		}
		if (data.antiVirus && data.antiVirus.length > 0) {
			this.getShowMcafee(data.antiVirus);
			this.otherAntiVirus = data.antiVirus[0];
			this.othersAntistatusList = [{
				status: this.otherAntiVirus.status,
				title: this.virusScan,
			}];
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityOthersAntiStatusList, this.othersAntistatusList);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityOtherAntiVirus, this.otherAntiVirus);
		} else {
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityOthersAntiStatusList, null);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityOtherAntiVirus, null);
		}
	}

	getShowMcafee(others: Array<OtherInfo>) {
		const show = this.findArray(others, this.partyAvList);
		this.showMcafee = show;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowMcafee, this.showMcafee);
	}

	findArray(others: Array<OtherInfo>, partyAvList) {
		let show = true;
		others.forEach((e) => {
			partyAvList.forEach((data) => {
				if (e.name === data) {
					show = false;
				}
			});
		});
		return show;
	}

	updateRegister(list: Array<any>, data) {
		this.mcafee.registered = data;
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

	getMcafeeMetric(metrics: Array<McafeeMetricsList>, data?) {
		const metricsList = [];
		const list = [];
		let metricsFeature = metrics;
		if (data) {
			metricsFeature = data;
		}
		if (metricsFeature.length === 0) {
			this.showMetricsList = false;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowMetricList, false);
		} else {
			this.showMetricsList = true;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowMetricList, true);
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
				this.showMetricButton = false;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowMetricButton, false);
				return list;
			} else {
				this.showMetricButton = true;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowMetricButton, true);
			}
		}
		return list;
	}

	getMcafeeFeature(mcafee: McAfeeInfo, data?: Array<McafeeFeature>) {
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

	setDefenderStatus(av: boolean | undefined, fw: boolean | undefined, currentPage: string) {
		let avStatus: string;
		let fwStatus: string;

		if (typeof av === 'boolean' && typeof fw === 'boolean') {
			avStatus = av ? 'enabled' : 'disabled';
			fwStatus = fw ? 'enabled' : 'disabled';
		} else if (typeof av !== 'boolean' && typeof fw === 'boolean') {
			fwStatus = fw ? 'enabled' : 'disabled';
			if (currentPage === 'windows') {
				avStatus = 'loading';
			}
		} else if (typeof av === 'boolean' && typeof fw !== 'boolean') {
			avStatus = av ? 'enabled' : 'disabled';
			if (currentPage === 'windows') {
				fwStatus = 'loading';
			}
		} else {
			return;
		}

		this.windowsDefenderstatusList = [{
			status: avStatus,
			title: this.virus,
			type: 'antivirus'
		}, {
			status: fwStatus,
			title: this.homeNetwork,
			type: 'firewall'
		}];
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.windowsDefenderstatusList);
	}

	retry(type: string) {
		this.windowsDefenderstatusList.forEach(element => {
			if (element.type === type) {
				element.status = 'loading';
				this.waitTimeout(type);
				this.antiVirus.refresh();
				return;
			}
		});
	}

	waitTimeout(type: string) {
		setTimeout(() => {
			this.windowsDefenderstatusList.forEach(element => {
				if (element.status === 'loading' && element.type === type) {
					element.status = 'failedLoad';
					return;
				}
			});
		}, 15000);
	}
}
