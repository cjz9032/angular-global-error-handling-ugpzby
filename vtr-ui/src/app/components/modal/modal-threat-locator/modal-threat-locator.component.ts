import {
	Component,
	OnInit,
	HostListener,
	Inject
} from '@angular/core';
import {
	NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import {
	VantageShellService
} from '../../../services/vantage-shell/vantage-shell.service';
import { DOCUMENT } from '@angular/common';

@Component({
	selector: 'vtr-modal-threat-locator',
	templateUrl: './modal-threat-locator.component.html',
	styleUrls: ['./modal-threat-locator.component.scss']
})
export class ModalThreatLocatorComponent implements OnInit {
	threatLocatorUrl: string;
	online: boolean;
	private metrics: any;
	ratio = 2;
	constructor(
		@Inject(DOCUMENT) private document: any,
		public activeModal: NgbActiveModal,
		private shellService: VantageShellService
	) {
		this.metrics = shellService.getMetrics();
	}
	@HostListener('window: focus')
	onFocus(): void {
		this.online = navigator.onLine;
		const modal = document.querySelector('.Threat-Locator-Modal') as HTMLElement;
		modal.focus();
	}
	@HostListener('window:message', ['$event'])
	onMessage(event: any): void {
		if (event.origin === 'https://locator.coro.net') {
			const eventData = JSON.parse(event.data);
			if (eventData.event === 'body') {
				return;
			}

			const metricsData = eventData.event.event;

			const data = {
				ItemType: 'FeatureClick',
				ItemName: `ThreatLocator.${metricsData}`,
				ItemParent: 'Features.SecurityAdvisor'
			};

			this.metrics.sendAsync(data);

			if (metricsData === 'usingWifiSecurityButtonClick') {
				this.closeModal();
			}
		}
	}

	private getThreatLocatorLanguageId(language: string): string {
		const iso639code = language.substring(0, 2);
		switch (iso639code) {
			case 'de':
			case 'es':
			case 'fr':
			case 'it':
			case 'ja':
			case 'pl':
			case 'pt':
			case 'ru':
			case 'tr':
				return iso639code;
			case 'zh':
				if (language.toLowerCase().includes('hans') ||
					language.toLowerCase().includes('cn') ||
					language.toLowerCase().includes('sg')) {
					return iso639code;
				}
				return 'en';
			default:
				return 'en';
		}
	}

	private buildThreatLocatorUrl(lang = 'en', limit = 400) {
		this.threatLocatorUrl = `https://locator.coro.net/lenovo?lang=${lang}&limit=${limit}`;
	}

	ngOnInit() {
		this.online = navigator.onLine;
		this.buildThreatLocatorUrl(
			this.getThreatLocatorLanguageId(navigator.language)
		);
	}

	closeModal() {
		this.activeModal.close('close');
	}

}
