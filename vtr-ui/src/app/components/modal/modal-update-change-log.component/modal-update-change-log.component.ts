import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-modal-update-change-log.',
	templateUrl: './modal-update-change-log.component.html',
	styleUrls: ['./modal-update-change-log.component.scss']
})
export class ModalUpdateChangeLogComponent implements OnInit, OnDestroy {

	@Output() url: string;
	updateModalMetrics: any;
	metrics: any;
	iframeInterval: any;

	constructor(
		public activeModal: NgbActiveModal,
		private shellService: VantageShellService
	) {
		this.metrics = this.shellService.getMetrics();
	}

	ngOnInit() {
		this.disableWheel()
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

	disableWheel() {
		const iframe: any = document.querySelector('#modal-update-change-log-iframe');
		this.iframeInterval = setInterval(() => {
			if (iframe.contentWindow) {
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
