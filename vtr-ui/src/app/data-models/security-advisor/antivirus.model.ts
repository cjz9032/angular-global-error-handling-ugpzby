import { Antivirus, McAfeeInfo, WindowsDefender, OtherInfo, EventTypes, McafeeMetricsList, McafeeFeature } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

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

	constructor(public antiVirus: Antivirus, private commonService: CommonService, public translate: TranslateService, ) {
		translate.stream(this.otherAntiVirus.name).subscribe((res) => {
			this.otherAntiVirus.name = res;
		});

		this.windowsDefenderstatusList.forEach(element => this.waitTimeout(element.type));

		const cacheCurrentPage = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);
		if (antiVirus.mcafee || antiVirus.others || antiVirus.windowsDefender) {
			this.antiVirusPage(antiVirus);
		} else if (cacheCurrentPage) {
			this.currentPage = cacheCurrentPage;
		}

		const cacheMcafeeStatusList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList);
		if (cacheMcafeeStatusList) {
			this.mcafeestatusList = cacheMcafeeStatusList;
		}

		const cacheMcafeeMetricsList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfeeMetricList);
		if (cacheMcafeeMetricsList) {
			this.metricsList = cacheMcafeeMetricsList;
		}

		const cacheWindowsDefender = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsDefender);
		if (antiVirus.windowsDefender) {
			this.windowsDefender = this.antiVirus.windowsDefender;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefender, this.windowsDefender);
			this.setDefenderStatus(this.windowsDefender.status,
				this.windowsDefender.firewallStatus,
				this.currentPage)
		} else {
			if (cacheWindowsDefender) {
				this.windowsDefender = cacheWindowsDefender;
				this.setDefenderStatus(this.windowsDefender.status,
					this.windowsDefender.firewallStatus,
					this.currentPage)

			}
		}

		const cacheShowMetricButton = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowMetricButton);
		if (typeof cacheShowMetricButton === 'boolean') {
			this.showMetricButton = cacheShowMetricButton;
		}
		const cacheShowMetricList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowMetricList);
		if (typeof cacheShowMetricList === 'boolean') {
			this.showMetricsList = cacheShowMetricList;
		}
		const cacheShowMcafee = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowMcafee);
		if (typeof cacheShowMcafee === 'boolean') {
			this.showMcafee = cacheShowMcafee;
		}

		const cacheWindowsList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList);
		if (cacheWindowsList) {
			this.windowsDefenderstatusList = cacheWindowsList;
		}
		const cacheOtherAntiVirusList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList);
		if (cacheOtherAntiVirusList) {
			this.othersAntistatusList = cacheOtherAntiVirusList;
		}
		const cacheOtherFirewallList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList);
		if (cacheOtherFirewallList) {
			this.othersFirewallstatusList = cacheOtherFirewallList;
		}

		const cacheOtherAntiVirus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOtherAntiVirus);
		if (cacheOtherAntiVirus) {
			this.otherAntiVirus = cacheOtherAntiVirus;
		}
		const cacheOtherFirewall = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOtherFirewall);
		if (cacheOtherFirewall) {
			this.otherFirewall = cacheOtherFirewall;
		}

		const cacheMcafee = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfee);
		if (antiVirus.mcafee) {
			if (this.mcafee) {
				this.mcafee = Object.assign({}, {
					localName: antiVirus.mcafee.localName,
					registered: antiVirus.mcafee.registered,
					subscription: antiVirus.mcafee.subscription,
					trialUrl: antiVirus.mcafee.trialUrl,
					enabled: antiVirus.mcafee.enabled,
					firewallStatus: antiVirus.mcafee.firewallStatus,
					status: antiVirus.mcafee.status,
					features: antiVirus.mcafee.features,
					expireAt: antiVirus.mcafee.expireAt,
					metrics: antiVirus.mcafee.metrics,
					additionalCapabilities: antiVirus.mcafee.additionalCapabilities,
				});
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
				if (this.mcafee.features) {
					this.mcafeestatusList = this.getMcafeeFeature(this.mcafee);
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.mcafeestatusList);
				}
				if (this.mcafee.metrics && this.mcafee.metrics.length > 0) {
					this.metricsList = this.getMcafeeMetric(this.mcafee.metrics);
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeMetricList, this.metricsList);
				} else {
					this.showMetricsList = false;
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricList, false);
				}
			}
		} else if (cacheMcafee) {
			this.mcafee = cacheMcafee;
		}

		if (antiVirus.others) {
			if (antiVirus.others.firewall && antiVirus.others.firewall.length > 0) {
				this.otherFirewall = antiVirus.others.firewall[0];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherFirewall, this.otherFirewall);
				this.othersFirewallstatusList = [{
					status: this.otherFirewall.status,
					title: this.fireWall,
				}];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, this.othersFirewallstatusList);
			} else { this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, null); }
			if (antiVirus.others.antiVirus && antiVirus.others.antiVirus.length > 0) {
				this.getShowMcafee(antiVirus.others.antiVirus);
				this.otherAntiVirus = antiVirus.others.antiVirus[0];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherAntiVirus, this.otherAntiVirus);
				this.othersAntistatusList = [{
					status: this.otherAntiVirus.status,
					title: this.virusScan,
				}];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, this.othersAntistatusList);
			} else { this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, null); }
		}

		antiVirus.on(EventTypes.avMcafeeFeaturesEvent, (data) => {
			this.mcafeestatusList = this.getMcafeeFeature(this.mcafee, data);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.mcafeestatusList);
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avOthersEvent, (data) => {
			if (data) {
				if (data.firewall && data.firewall.length > 0) {
					this.otherFirewall = data.firewall[0];
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherFirewall, this.otherFirewall);
					this.othersFirewallstatusList = [{
						status: this.otherFirewall.status,
						title: this.fireWall,
					}];
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, this.othersFirewallstatusList);
				} else {
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, null);
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherFirewall, null);
				}
				if (data.antiVirus && data.antiVirus.length > 0) {
					this.getShowMcafee(data.antiVirus);
					this.otherAntiVirus = data.antiVirus[0];
					this.othersAntistatusList = [{
						status: this.otherAntiVirus.status,
						title: this.virusScan,
					}];
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, this.othersAntistatusList);
				} else {
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, null);
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherAntiVirus, null);
				}
			}
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			this.windowsDefender.status = data;
			this.setDefenderStatus(this.windowsDefender.status,
				this.windowsDefender.firewallStatus,
				this.currentPage)
			this.antiVirusPage(this.antiVirus);
		}).on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			this.windowsDefender.firewallStatus = data;
			this.setDefenderStatus(this.windowsDefender.status,
				this.windowsDefender.firewallStatus,
				this.currentPage)
			this.antiVirusPage(this.antiVirus);
		}).on(EventTypes.avMcafeeExpireAtEvent, (data) => {
			this.mcafee.expireAt = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
		}).on(EventTypes.avMcafeeSubscriptionEvent, (data) => {
			this.mcafee.subscription = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avMcafeeRegisteredEvent, (data) => {
			this.mcafeestatusList = this.updateRegister(this.mcafeestatusList, data);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.mcafeestatusList);
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avMcafeeMetricsEvent, (data) => {
			this.metricsList = this.getMcafeeMetric(this.metricsList, data);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeMetricList, this.metricsList);
		}).on(EventTypes.avMcafeeTrialUrlEvent, (data) => {
			this.mcafee.trialUrl = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeTrialUrl, this.mcafee.trialUrl);
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

	antiVirusPage(antiVirus: Antivirus) {
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled) && antiVirus.mcafee.expireAt > 0) {
			this.currentPage = 'mcafee';
			this.mcafeeInstall = true;
		} else if (antiVirus.others && antiVirus.others.enabled) {
			if (antiVirus.mcafee) {
				this.mcafeeInstall = true;
			} else { this.mcafeeInstall = false; }
			this.currentPage = 'others';
		} else {
			this.currentPage = 'windows';
			this.mcafeeInstall = false;
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityCurrentPage, this.currentPage);
	}

	getShowMcafee(others: Array<OtherInfo>) {
		const show = this.findArray(others, this.partyAvList);
		this.showMcafee = show;
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMcafee, this.showMcafee);
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
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricList, false);
		} else {
			this.showMetricsList = true;
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
				this.showMetricButton = false;
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricButton, false);
				return list;
			} else {
				this.showMetricButton = true;
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowMetricButton, true);
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
			if (currentPage === 'windows') {
				avStatus = 'loading';
				fwStatus = 'loading';
			}
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
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.windowsDefenderstatusList);
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
