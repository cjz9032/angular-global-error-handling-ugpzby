import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AntivirusCommon } from '../../../../../data-models/security-advisor/antivirus-common.model';

@Component({
	selector: 'vtr-widget-mcafee-features',
	templateUrl: './widget-mcafee-features.component.html',
	styleUrls: ['./widget-mcafee-features.component.scss'],
})
export class WidgetMcafeeFeaturesComponent implements OnInit {
	@Input() install: boolean;
	@Input() name: string;
	@Input() isOnline: boolean;
	@Input() common: AntivirusCommon;
	items = [
		{
			image: '../../../../../../assets/images/antivirus/optimized_performance_icon.svg',
			title: 'security.antivirus.others.featuresTitle1',
			desc: 'security.antivirus.others.featuresDesc1',
		},
		{
			image: '../../../../../../assets/images/antivirus/effective_antivirus_icon.svg',
			title: 'security.antivirus.others.featuresTitle2',
			desc: 'security.antivirus.others.featuresDesc2',
		},
		{
			image: '../../../../../../assets/images/antivirus/password_icon.svg',
			title: 'security.antivirus.others.featuresTitle3',
			desc: 'security.antivirus.others.featuresDesc3',
		},
		{
			image: '../../../../../../assets/images/antivirus/safe_browsing_icon.svg',
			title: 'security.antivirus.others.featuresTitle4',
			desc: 'security.antivirus.others.featuresDesc4',
		},
	];

	getMcafeeText = this.translate.instant('security.antivirus.others.exploreButton');
	launchMcafeeText = this.translate.instant('security.antivirus.mcafee.launch');
	constructor(private translate: TranslateService) {}

	ngOnInit(): void {}
}
