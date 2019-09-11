import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { AntivirusCommon } from 'src/app/data-models/security-advisor/antivirus-common.model';

@Component({
	selector: 'vtr-widget-mcafee',
	templateUrl: './widget-mcafee.component.html',
	styleUrls: ['./widget-mcafee.component.scss'],
})
export class WidgetMcafeeComponent implements OnInit {

	@Input() install: any;
	@Input() name: string;
	@Input() isOnline: boolean;
	@Input() common: AntivirusCommon;
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
			this.urlGetMcAfee = `https://home.mcafee.com/root/campaign.aspx?cid=233426&affid=714&culture=${this.getLanguageIdentifier()}`;
		}).catch(e => {
			this.country = 'us';
		});
		this.urlGetMcAfee = `https://home.mcafee.com/root/campaign.aspx?cid=233426&affid=714&culture=${this.getLanguageIdentifier()}`;
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
