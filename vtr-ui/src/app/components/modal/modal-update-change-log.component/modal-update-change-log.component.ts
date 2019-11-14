import { Component, OnInit, Output, OnDestroy, AfterViewInit, SecurityContext } from '@angular/core';
import { SafeUrl, SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

declare let Windows: any;

@Component({
	selector: 'vtr-modal-update-change-log.',
	templateUrl: './modal-update-change-log.component.html',
	styleUrls: ['./modal-update-change-log.component.scss']
})
export class ModalUpdateChangeLogComponent implements OnInit, AfterViewInit, OnDestroy {

	@Output() url: string;
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
		const warrantyUrl = `https://download.lenovo.com/pccbbs/mobiles/n2car17w.txt`;
		const uri = new Windows.Foundation.Uri(warrantyUrl);
		const request = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.get, uri);
		const httpClient = new Windows.Web.Http.HttpClient();
		(async () => {
			try {
				const response = await httpClient.sendRequestAsync(request);
				const result = await response.content.readAsStringAsync();
				if (result) {
					this.articleBody = this.sanitizer.sanitize(SecurityContext.HTML, result);
					console.log(result);
					// resolve(Warranty.getWarranty(result));
				} else {
					// reject(new Error('can not get warranty information'));
				}
			} catch (e) {
				// reject(new Error('can not get warranty information'));
			}
			httpClient.close();
		})();
	}

	ngAfterViewInit() {
		this.disableZoom();
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
		clearInterval(this.iframeInterval);
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
			console.log('can not find metrics');
		}
	}

	disableZoom() {
		const iframe: any = document.querySelector('#modal-update-change-log-iframe');
		this.iframeInterval = setInterval(() => {
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.addEventListener('mousewheel', (event: any) => {
					if (event.ctrlKey === true || event.metaKey) {
						event.preventDefault();
					}
				}, false);
				clearInterval(this.iframeInterval);
			}
		}, 50);
	}

	closeModal() {
		this.activeModal.close('close');
	}

}
