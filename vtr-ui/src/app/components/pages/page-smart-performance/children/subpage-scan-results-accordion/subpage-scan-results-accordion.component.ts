import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionState } from 'src/app/enums/smart-performance.enum';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import {
	SPHistoryScanResultsDateTime,
	SPResult,
	SPResultContent,
} from '../../interface/smart-performance.interface';

@Component({
	selector: 'vtr-subpage-scan-results-accordion',
	templateUrl: './subpage-scan-results-accordion.component.html',
	styleUrls: ['./subpage-scan-results-accordion.component.scss'],
})
export class SubpageScanResultsAccordionComponent implements OnInit {
	@Input() resultItem: SPHistoryScanResultsDateTime;
	spResults: SPResult[] = [
		{
			id: 'Tune-up-performance',
			header: {
				id: 'smart-performance-scan-result-tunPC-title',
				icon: 'icomoon-tune-pc',
				title: 'smartPerformance.tunePCPerformance.title',
				pId: 'smart-performance-scan-result-tunPC-count',
			},
			activeContentId: 'smart-performance-scan-result-tunPC-tabSet1-tab1',
			contents: [
				{
					id: 'smart-performance-scan-result-tunPC-tabSet1-tab1',
					icon: 'icomoon-e-junk',
					title: 'smartPerformance.tunePCPerformance.tabSet1.tab1',
					countId: 'tune_accumulatedjunk',
					sections: [
						'smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area1',
						'smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area2',
						'smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area3',
						'smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area4',
						'smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area5',
						'smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-tunPC-tabSet1-tab2',
					icon: 'icomoon-usibilityIssue',
					title: 'smartPerformance.tunePCPerformance.tabSet1.tab2',
					countId: 'tune_usabilityissues',
					sections: [
						'smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area1',
						'smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area2',
						'smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area3',
						'smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area4',
						'smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area5',
						'smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-tunPC-tabSet1-tab3',
					icon: 'icomoon-windows',
					title: 'smartPerformance.tunePCPerformance.tabSet1.tab3',
					countId: 'tune_windowssettings',
					sections: [
						'smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area1',
						'smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area2',
						'smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area3',
						'smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area4',
						'smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area5',
						'smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-tunPC-tabSet1-tab4',
					icon: 'icomoon-annoying-adware',
					title: 'smartPerformance.tunePCPerformance.tabSet1.tab4',
					countId: 'tune_systemerrors',
					sections: [
						'smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area1',
						'smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area2',
						'smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area3',
						'smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area4',
						'smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area5',
						'smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-tunPC-tabSet1-tab5',
					icon: 'icomoon-registery-errors',
					title: 'smartPerformance.tunePCPerformance.tabSet1.tab5',
					countId: 'tune_registryerrors',
					sections: [
						'smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area1',
						'smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area2',
						'smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area3',
						'smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area4',
						'smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area5',
						'smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area6',
					],
				},
			],
		},
		{
			id: 'Internet-performance',
			header: {
				id: 'smart-performance-scan-result-boost-extra-title',
				icon: 'icomoon-boost-internet',
				title: 'smartPerformance.boostInternetPerformance.extraTitle',
				pId: 'smart-performance-scan-result-boost-issue-count',
			},
			activeContentId: 'smart-performance-scan-result-boost-tabSet1-tab1',
			contents: [
				{
					id: 'smart-performance-scan-result-boost-tabSet1-tab1',
					icon: 'icomoon-e-junk',
					title: 'smartPerformance.boostInternetPerformance.tabSet1.tab1',
					countId: 'boost_ejunk',
					sections: [
						'smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area1',
						'smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area2',
						'smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area3',
						'smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area4',
						'smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area5',
						'smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-boost-tabSet1-tab2',
					icon: 'icomoon-network-settings',
					title: 'smartPerformance.boostInternetPerformance.tabSet1.tab2',
					countId: 'boost_networksettings',
					sections: [
						'smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area1',
						'smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area2',
						'smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area3',
						'smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area4',
						'smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area5',
						'smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-boost-tabSet1-tab3',
					icon: 'icomoon-browser-settings',
					title: 'smartPerformance.boostInternetPerformance.tabSet1.tab3',
					countId: 'boost_browsersettings',
					sections: [
						'smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area1',
						'smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area2',
						'smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area3',
						'smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area4',
						'smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area5',
						'smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-boost-tabSet1-tab4',
					icon: 'icomoon-browser-security',
					title: 'smartPerformance.boostInternetPerformance.tabSet1.tab4',
					countId: 'boost_browsersecurity',
					sections: [
						'smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area1',
						'smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area2',
						'smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area3',
						'smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area4',
						'smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area5',
						'smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-boost-tabSet1-tab5',
					icon: 'icomoon-wifi',
					title: 'smartPerformance.boostInternetPerformance.tabSet1.tab5',
					countId: 'boost_wifiperformance',
					sections: [
						'smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area1',
						'smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area2',
						'smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area3',
						'smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area4',
						'smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area5',
						'smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area6',
					],
				},
			],
		},
		{
			id: 'Malware-Security',
			header: {
				id: 'smart-performance-scan-result-malware-title',
				icon: 'icomoon-malware',
				title: 'smartPerformance.malwareSecurity.title',
				pId: 'smart-performance-scan-result-malware-issue-count',
			},
			activeContentId: 'smart-performance-scan-result-malware-tabSet1-tab1',
			contents: [
				{
					id: 'smart-performance-scan-result-malware-tabSet1-tab1',
					icon: 'icomoon-malware-scan',
					title: 'smartPerformance.malwareSecurity.tabSet1.tab1',
					countId: 'secure_malwarescan',
					sections: [
						'smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area1',
						'smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area2',
						'smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area3',
						'smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area4',
						'smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area5',
						'smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-malware-tabSet1-tab2',
					icon: 'icomoon-zero-day',
					title: 'smartPerformance.malwareSecurity.tabSet1.tab2',
					countId: 'secure_zerodayinfections',
					sections: [
						'smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area1',
						'smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area2',
						'smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area3',
						'smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area4',
						'smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area5',
						'smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-malware-tabSet1-tab3',
					icon: 'icomoon-errant-program',
					title: 'smartPerformance.malwareSecurity.tabSet1.tab3',
					countId: 'secure_errantprograms',
					sections: [
						'smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area1',
						'smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area2',
						'smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area3',
						'smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area4',
						'smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area5',
						'smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-malware-tabSet1-tab4',
					icon: 'icomoon-annoying-adware',
					title: 'smartPerformance.malwareSecurity.tabSet1.tab4',
					countId: 'secure_annoyingadware',
					sections: [
						'smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area1',
						'smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area2',
						'smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area3',
						'smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area4',
						'smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area5',
						'smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area6',
					],
				},
				{
					id: 'smart-performance-scan-result-malware-tabSet1-tab5',
					icon: 'icomoon-security-settings',
					title: 'smartPerformance.malwareSecurity.tabSet1.tab5',
					countId: 'secure_securitysettings',
					sections: [
						'smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area1',
						'smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area2',
						'smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area3',
						'smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area4',
						'smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area5',
						'smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area6',
					],
				},
			],
		},
	];

	currentContent: SPResultContent = this.spResults[0].contents[0];

	isEn: boolean;
	isLongWordLang: boolean;
	SubscriptionState = SubscriptionState;

	constructor(
		public smartPerformanceService: SmartPerformanceService,
		private translate: TranslateService
	) {}
	ngOnInit(): void {
		const curLang = this.translate.currentLang;
		this.isEn = curLang === 'en';
		this.isLongWordLang = curLang === 'de' || curLang === 'sv'
			|| curLang === 'da' || curLang === 'fi' || curLang === 'hu' || curLang === 'nb'
			|| curLang === 'nl';
	}

	switchToResultCard(element: any, isExpanded: boolean, result: SPResult) {
		if (isExpanded) {
			this.currentContent = result.contents[0];
		}
	}

	switchToSubCategory(result: SPResult, content: SPResultContent) {
		result.activeContentId = content.id;
		this.currentContent = content;
	}

}
