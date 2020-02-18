import { Component, OnInit, OnDestroy, SecurityContext, HostListener } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

declare let Windows: any;

@Component({
	selector: 'vtr-modal-update-change-log.',
	templateUrl: './modal-update-change-log.component.html',
	styleUrls: ['./modal-update-change-log.component.scss']
})
export class ModalUpdateChangeLogComponent implements OnInit, OnDestroy {

	url: string;
	updateModalMetrics: any;
	metrics: any;
	iframeInterval: any;
	articleBody: SafeHtml = '';

	constructor(
		public activeModal: NgbActiveModal,
		private sanitizer: DomSanitizer,
		private shellService: VantageShellService
	) {
		this.metrics = this.shellService.getMetrics();
	}

	ngOnInit() {
		const uri = new Windows.Foundation.Uri(this.url);
		const request = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.get, uri);
		const httpClient = new Windows.Web.Http.HttpClient();
		(async () => {
			try {
				const response = await httpClient.sendRequestAsync(request);
				const result = await response.content.readAsStringAsync();
				if (result) {
					this.articleBody = this.sanitizer.sanitize(SecurityContext.HTML, result);
				} else {}
			} catch (e) {}
			httpClient.close();
		})();
	}

	ngOnDestroy() {
		const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: this.updateModalMetrics.pageName,
			PageContext: this.updateModalMetrics.pageContext,
			PageDuration: 0,
			OnlineStatus: ''
		};
		this.sendMetricsAsync(pageViewMetrics);
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {}
	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.update-read-more-modal-size') as HTMLElement;
		modal.focus();
	}

}
