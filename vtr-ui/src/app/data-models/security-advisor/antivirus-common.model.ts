import { Antivirus, McAfeeInfo, WinRT } from '@lenovo/tan-client-bridge';
import { AppNotification } from '../common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { MetricService } from 'src/app/services/metric/metric.service';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';

export class AntivirusCommon {
	antivirus: Antivirus;
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
	startTrialDisabled = false;
	isOnline: boolean;
	purchaseBtnIsLoading: boolean;
	metricsParent = 'Security.antivirus';
	nls = new Map([
		['cs', 'Cs-CZ'],
		['da', 'Da-DK'],
		['nl', 'Nl-NL'],
		['gb', 'En-GB'],
		['fi', 'Fi-FI'],
		['fr', 'Fr-FR'],
		['de', 'De-DE'],
		['el', 'El-GR'],
		['it', 'It-IT'],
		['nb', 'Nb-NO'],
		['pl', 'Pl-PL'],
		['pt', 'Pt-PT'],
		['br', 'Pt-BR'],
		['ru', 'Ru-RU'],
		['es', 'Es-ES'],
		['sv', 'Sv-SV'],
		['tr', 'Tr-TR'],
		['*', 'En-US'],
	]);
	urlGetMcAfee: string;
	country: string;
	pluginSupport: boolean;
	constructor(antivirus: Antivirus,
		isOnline: boolean,
		private localInfoService: LocalInfoService,
		private commonService: CommonService,
		public translate: TranslateService,
		public metrics: MetricService,
		public metricsTranslateService: MetricsTranslateService,
		public hypSettings: HypothesisService) {
		this.hypSettings.getFeatureSetting('AntivirusLaunchMcAfeeBuy').then((result) => {
			this.pluginSupport = result === 'true';
		})
		const cacheMcafee = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfee);
		if (cacheMcafee) {
			this.mcafee = cacheMcafee;
		}
		if (antivirus) {
			this.antivirus = antivirus;
			if (this.antivirus.mcafee) {
				this.mcafee = this.antivirus.mcafee;
			}
		}
		this.isOnline = isOnline;
		this.localInfoService.getLocalInfo().then(result => {
			this.country = result.GEO;
			this.urlGetMcAfee = `https://home.mcafee.com/root/campaign.aspx?cid=233426&affid=714&culture=${this.getLanguageIdentifier()}`;
		}).catch(e => {
			this.country = 'us';
		});
		this.urlGetMcAfee = `https://home.mcafee.com/root/campaign.aspx?cid=233426&affid=714&culture=${this.getLanguageIdentifier()}`;
	}

	openMcAfeePurchase() {
		const metricsData = {
			ItemParent: this.metricsParent,
			ItemName: this.metricsTranslateService.translate('launchMcAfeeBuy.failed'),
			ItemType: 'FeatureClick'
		};
		this.purchaseBtnIsLoading = true;
		let purchaseRes;
		if (this.mcafee && this.mcafee.additionalCapabilities
			&& this.mcafee.additionalCapabilities.includes('LaunchMcAfeeBuy')
			&& this.pluginSupport) {
			this.antivirus.openMcAfeePurchaseUrl().then((response) => {
				purchaseRes = response;
				this.purchaseBtnIsLoading = false;
				if (response && response.result === false) {
					WinRT.launchUri(this.urlGetMcAfee);
				}
				metricsData.ItemName = this.metricsTranslateService.translate('launchMcAfeeBuy.success');
			}).catch(() => {
				this.purchaseBtnIsLoading = false;
				WinRT.launchUri(this.urlGetMcAfee);
			}).finally(() => {
				this.metrics.sendMetrics(metricsData);
			});
			setTimeout(() => {
				if (!purchaseRes) {
					this.purchaseBtnIsLoading = false;
					WinRT.launchUri(this.urlGetMcAfee);
					metricsData.ItemName = this.metricsTranslateService.translate('launchMcAfeeBuy.timeout');
					this.metrics.sendMetrics(metricsData);
				}
			}, 3000)
		} else {
			this.purchaseBtnIsLoading = false;
			WinRT.launchUri(this.urlGetMcAfee);
			this.metrics.sendMetrics(metricsData);
		}
	}

	launch() {
		if (this.antivirus) {
			if (this.antivirus.mcafee) {
				this.mcafee = this.antivirus.mcafee;
			}
			if (this.mcafee
				&& !this.mcafee.registered
				&& this.mcafee.additionalCapabilities
				&& this.mcafee.additionalCapabilities.includes('OpenWSSInContext')) {
				this.antivirus.openMcAfeeRegistry().then((response) => {
					if (response && response.result === false) {
						this.antivirus.launch();
					}
				}).catch(() => {
					this.antivirus.launch();
				});
			}
			else {
				this.antivirus.launch();
			}
		}
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

	getLanguageIdentifier() {
		const language = (typeof this.translate.currentLang === 'string') ? this.translate.currentLang.substring(0, 2) : '*';
		if (language === 'en' && this.country === 'gb') {
			return this.nls.get('gb');
		}
		if (language === 'pt' && this.country === 'br') {
			return this.nls.get('br');
		}
		if (this.nls.has(language)) {
			return this.nls.get(language);
		}
		return this.nls.get('*');
	}

}
