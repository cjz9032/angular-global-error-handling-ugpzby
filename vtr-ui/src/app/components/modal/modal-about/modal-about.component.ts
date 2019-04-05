import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'vtr-modal-about',
	templateUrl: './modal-about.component.html',
	styleUrls: ['./modal-about.component.scss']
})
export class ModalAboutComponent implements OnInit {

	url: string;
	/** type will be 'html' or 'txt' */
	type: string;
	articleBody: SafeHtml = '<div class="spinner-content"><div class="spinner-border text-primary progress-spinner" role="status"></div></div>';

	constructor(
		public activeModal: NgbActiveModal,
		private http: HttpClient,
		private sanitizer: DomSanitizer
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
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('enable');
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
