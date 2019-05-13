import { Component, OnInit, Input } from '@angular/core';
import { isString } from 'lodash/isString';


@Component({
	selector: 'vtr-widget-mcafee',
	templateUrl: './widget-mcafee.component.html',
	styleUrls: ['./widget-mcafee.component.scss'],
})
export class WidgetMcafeeComponent implements OnInit {

	@Input() install: any;
	@Input() name: string;
	@Input() mcafee: any;
	urlGetMcAfee: string;
	nls = new Map([
		['cs', 'CZ'],
		['da', 'DK'],
		['nl', 'NL'],
		['en-GB', 'En-GB'],
		['en-US', 'En-US'],
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

	ngOnInit() {
		this.urlGetMcAfee = `https://home.mcafee.com/root/campaign.aspx?cid=233426&affid=714&culture=${this.getLanguageIdentifier()}`;
	}

	getLanguageIdentifier() {
		if (this.nls.has(navigator.language)) { return this.nls.get(navigator.language); }
		const language = isString(navigator.language) ? navigator.language.substring(0, 2) : '*';
		if (this.nls.has(language)) { return this.nls.get(language); }
		return this.nls.get('*');
	}
}



