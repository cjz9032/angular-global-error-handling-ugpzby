import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vtr-ui-accordion',
  templateUrl: './ui-accordion.component.html',
  styleUrls: ['./ui-accordion.component.scss']
})
export class UiAccordionComponent implements OnInit {
  @Input() tune = 0;
	@Input() boost = 0;
  @Input() secure = 0;
  scannigResultObj = {tunePc : {firstSection: [], secondSection: [], thirdSection: [], fourthSection: [], fifthSection:[]},
  internetPerformance : {firstSection: [], secondSection: [], thirdSection: [], fourthSection: [], fifthSection:[]},
  malwareSecurity : {firstSection: [], secondSection: [], thirdSection: [], fourthSection: [], fifthSection:[]},};
  constructor(private translate: TranslateService) { }
  ngOnInit(): void {
	this.initContentLoad();
}
  public initContentLoad() {
	this.scannigResultObj.tunePc = {
		firstSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area2')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area6')
		}],
		secondSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area2')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area6')
		}
		],
		thirdSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area6')
		}],
		fourthSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area6')
		}],
		fifthSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area6')
		}],
	}
	this.scannigResultObj.internetPerformance = {
		firstSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area2')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area6')
		}],
		secondSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area2')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area6')
		}
		],
		thirdSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area6')
		}],
		fourthSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area6')
		}],
		fifthSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area6')
		}],
	}
	this.scannigResultObj.malwareSecurity = {
		firstSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area2')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area6')
		}],
		secondSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area2')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area6')
		}
		],
		thirdSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area6')
		}],
		fourthSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area6')
		}],
		fifthSection: [{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area1'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area2')
		}, {
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area3'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area4')
		},
		{
		firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area5'),
		secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area6')
		}],
	}
  }
}
