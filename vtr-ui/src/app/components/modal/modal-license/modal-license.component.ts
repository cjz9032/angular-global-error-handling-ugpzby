import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-modal-license',
	templateUrl: './modal-license.component.html',
	styleUrls: ['./modal-license.component.scss']
})
export class ModalLicenseComponent implements OnInit, OnDestroy {

	url: string;
	/** type will be 'html' or 'txt' */
	type: string;
	articleBody: SafeHtml = '<div class="spinner-content"><div class="spinner-border text-primary progress-spinner" role="status"></div></div>';
	licenseModalMetrics: any;
	pageDuration: number;
	metrics: any;

	constructor(
		public activeModal: NgbActiveModal,
		private http: HttpClient,
		private sanitizer: DomSanitizer,
		private shellService: VantageShellService,
	) {
		this.metrics = this.shellService.getMetrics();
	}

	ngOnInit() {
		this.http.get(this.url, { responseType: 'text' }).subscribe((results: any) => {
			// console.log(this.sanitizer.bypassSecurityTrustHtml(results));
			if (this.type === 'txt') {
				const openSource = results.replace(/\< /g, '<').replace(/ \>/g, '>').replace(/\</g, '< ').replace(/\>/g, ' >');
				this.articleBody = `<pre>${openSource}</pre>`;
			} else {
				this.articleBody = this.sanitizer.bypassSecurityTrustHtml(results);
			}
		});
		this.pageDuration = 0;
		setInterval(() => {
			this.pageDuration += 1;
		}, 1000);
	}

	ngOnDestroy() {
		const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: this.licenseModalMetrics.pageName,
			PageContext: this.licenseModalMetrics.pageContext,
			PageDuration: this.pageDuration,
			OnlineStatus: ''
		};
		this.sendMetricsAsync(pageViewMetrics);
		console.log(pageViewMetrics);
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
}
