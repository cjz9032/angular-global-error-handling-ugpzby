import { Component, OnInit, Output, OnDestroy, HostListener } from '@angular/core';
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

	constructor(
		public activeModal: NgbActiveModal,
		private shellService: VantageShellService
	) {
		this.metrics = this.shellService.getMetrics();
	}

	ngOnInit() {
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
		console.log(pageViewMetrics);
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
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
		const modal = document.querySelector('.update-read-more-modal-size') as HTMLElement;
		modal.focus();
	}

}
