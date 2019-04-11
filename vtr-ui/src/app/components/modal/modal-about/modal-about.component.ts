import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { SupportService } from 'src/app/services/support/support.service';

@Component({
	selector: 'vtr-modal-about',
	templateUrl: './modal-about.component.html',
	styleUrls: ['./modal-about.component.scss']
})
export class ModalAboutComponent implements OnInit, OnDestroy {

	url: string;
	/** type will be 'html' or 'txt' */
	type: string;
	articleBody: SafeHtml = '<div class="spinner-content"><div class="spinner-border text-primary progress-spinner" role="status"></div></div>';
	aboutModalMetrics: any;
	pageDuration: number;

	constructor(
		public activeModal: NgbActiveModal,
		private http: HttpClient,
		private sanitizer: DomSanitizer,
		private supportService: SupportService
	) { }

	ngOnInit() {
		this.http.get(this.url, { responseType: 'text' }).subscribe((results: any) => {
			// console.log(this.sanitizer.bypassSecurityTrustHtml(results));
			if (this.type === 'txt') {
				this.articleBody = `<pre>${results}</pre>`;
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
			PageName: this.aboutModalMetrics.pageName,
			PageContext: this.aboutModalMetrics.pageContext,
			PageDuration: this.pageDuration,
			OnlineStatus: ''
		};
		this.supportService.sendMetricsAsync(pageViewMetrics);
		console.log(pageViewMetrics);
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('enable');
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
