import { Antivirus } from '@lenovo/tan-client-bridge';
import { AppNotification } from '../common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { TranslateService } from '@ngx-translate/core';

export class AntivirusCommon {
	antivirus: Antivirus;
	startTrialDisabled = false;
	isOnline: boolean;
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
	constructor(antivirus: Antivirus, isOnline: boolean, private localInfoService: LocalInfoService, public translate: TranslateService, ) {
		if (antivirus) {
			this.antivirus = antivirus;
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

	launch() {
		this.antivirus.launch();
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
