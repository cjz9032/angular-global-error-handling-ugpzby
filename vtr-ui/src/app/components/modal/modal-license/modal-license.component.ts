import { Component, OnInit, OnDestroy, SecurityContext, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { TimerService } from 'src/app/services/timer/timer.service';

@Component({
	selector: 'vtr-modal-license',
	templateUrl: './modal-license.component.html',
	styleUrls: ['./modal-license.component.scss'],
	providers: [TimerService]
})
export class ModalLicenseComponent implements OnInit, OnDestroy {

	url: string;
	/** type will be 'html' or 'txt' */
	type: string;
	articleBody: SafeHtml = '';
	licenseModalMetrics: any;
	pageDuration: number;
	metrics: any;
	loading = true;

	constructor(
		public activeModal: NgbActiveModal,
		private http: HttpClient,
		private sanitizer: DomSanitizer,
		private shellService: VantageShellService,
		private timerService: TimerService
	) {
		this.metrics = this.shellService.getMetrics();
	}

	ngOnInit() {
		this.http.get(this.url, { responseType: 'text' }).subscribe((results: any) => {
			if (this.type === 'txt') {
				this.loading = false;
				const openSource = results.replace(/\< /g, '<').replace(/ \>/g, '>').replace(/\</g, '< ').replace(/\>/g, ' >');
				this.articleBody = `<pre>${openSource}</pre>`;
			} else {
				this.loading = false;
				this.setIframeUrl();
			}
		});
		this.timerService.start();
		setTimeout(() => { 
			document.getElementById('license-dialog').parentElement.parentElement.parentElement.parentElement.focus();
			document.getElementById('license-dialog-empty').focus();
		}, 0);
	}

	ngOnDestroy() {
		const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: this.licenseModalMetrics.pageName,
			PageContext: this.licenseModalMetrics.pageContext,
			PageDuration: this.timerService.stop(),
			OnlineStatus: ''
		};
		this.sendMetricsAsync(pageViewMetrics);
		console.log(pageViewMetrics);
	}

	setIframeUrl() {
		const licenseAgreementIframe: any = document.getElementById('license-agreement-iframe');
		licenseAgreementIframe.src = this.url;
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			console.log('metrics ready!');
			this.metrics.sendAsync(data);
		} else {
			console.log('can not find metrics');
		}
	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.license-Modal') as HTMLElement;
		modal.focus();
	}
}
