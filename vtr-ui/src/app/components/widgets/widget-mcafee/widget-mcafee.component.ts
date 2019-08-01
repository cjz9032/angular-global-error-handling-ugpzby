import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import isString from 'lodash/isString';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

@Component({
	selector: 'vtr-widget-mcafee',
	templateUrl: './widget-mcafee.component.html',
	styleUrls: ['./widget-mcafee.component.scss'],
})
export class WidgetMcafeeComponent implements OnInit {

	@Input() install: any;
	@Input() name: string;
	@Input() mcafee: any;
	@Input() isOnline: boolean;
	urlGetMcAfee: string;
	country: string;
	nls = new Map([
		['cs', 'Cs-CZ'],
		['da', 'Da-DK'],
		['nl', 'Nl-NL'],
		['gb', 'En-GB'],
		['fi', 'Fi-FI'],
		['fr', 'Fr-FR'],
		['de', 'De-DE'],
		['el', 'El-GR'],
		['lt', 'It-IT'],
		['no', 'Nb-NO'],
		['pl', 'Pl-PL'],
		['pt', 'Pt-PT'],
		['ru', 'Ru-RU'],
		['es', 'Es-ES'],
		['sv', 'Sv-SV'],
		['tr', 'Tr-TR'],
		['*', 'En-US'],
	]);
	statusList = [{
		status: 'disabled',
		title: 'security.antivirus.common.virusScan',
	}, {
		status: 'disabled',
		title: 'security.antivirus.common.firewall',
	}];

	constructor(
		public translate: TranslateService,
		private localInfoService: LocalInfoService
		) { }

	ngOnInit() {
		this.localInfoService.getLocalInfo().then(result => {
			this.country = result.GEO;
		}).catch(e => {
			this.country = 'us';
		});
		this.urlGetMcAfee = `https://home.mcafee.com/root/campaign.aspx?cid=233426&affid=714&culture=${this.getLanguageIdentifier()}`;
	}

	getLanguageIdentifier() {
		const language = isString(this.translate.currentLang) ? this.translate.currentLang.substring(0, 2) : '*';
		if (language === 'en' && this.country === 'gb') {
			return this.nls.get('gb');
		}
		if (this.nls.has(language)) {
			return this.nls.get(language);
		}
		return this.nls.get('*');
	}
}
