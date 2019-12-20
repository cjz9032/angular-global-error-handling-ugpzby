import { Component, OnInit, ElementRef, HostListener, SecurityContext, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { ActivatedRoute } from '@angular/router';
import { TimerService } from 'src/app/services/timer/timer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-modal-dcc-detail',
	templateUrl: './modal-dcc-detail.component.html',
	styleUrls: ['./modal-dcc-detail.component.scss'],
	providers: [TimerService]
})
export class ModalDccDetailComponent implements OnInit, AfterViewInit {

	metricClient: any;
	enterTime: number;
	metricsParent = '';

	dccTitle = this.translateService.instant('dcc.heroBanner.description').toUpperCase();

	constructor(
		public activeModal: NgbActiveModal,
		vantageShellService: VantageShellService,
		private activatedRoute: ActivatedRoute,
		private timerService: TimerService,
		private translateService: TranslateService
	) {
		this.metricClient = vantageShellService.getMetrics();
		this.metricsParent = this.getPageName(activatedRoute) + '.DccDetails';
	}

	ngOnInit() {
		this.enterTime = new Date().getTime();
		this.timerService.start();
	}

	ngAfterViewInit() {
		setTimeout(() => {
			(document.querySelector('.Dcc-Detail-Modal') as HTMLElement).focus();
		}, 0);
	}

	private getPageName(activatedRoute: ActivatedRoute) {
		try {
			return activatedRoute.children[0].firstChild.routeConfig.data.pageName;
		} catch (ex) {}

		try {
			return activatedRoute.firstChild.snapshot.data.pageName;
		} catch (ex) {}

		return undefined;
	}

	enableBatteryChargeThreshold() {
		this.activeModal.close('enable');
	}

	// this function would only be fired when the modal backdrop was clicked,
	// and the modal would be closed automatically in this scenario
	onBeforeDismiss() {
		this.sendDccDetailsViewMetric();
	}

	sendDccDetailsViewMetric() {
		if (this.metricClient) {
			const dccBox = document.querySelector('.dcc-content') as HTMLElement;
			const dccContent = document.querySelector('.dcc-body') as HTMLElement;
			let DocReadPosition = -1;
			if (dccBox && dccContent) {
				DocReadPosition = (dccBox.scrollTop + dccBox.offsetHeight) * 100 / dccContent.offsetHeight;
				DocReadPosition = Math.round(DocReadPosition);
			}
			const metricsData = {
				ItemType: 'DccDetailsView',
				ItemID: '',
				ItemParent: this.metricsParent,
				ItemCategory: '',
				Duration: this.timerService.stop(),
				DocReadPosition,
				MediaReadPosition: 0
			};
			this.metricClient.sendAsync(metricsData);
		}
	}

	closeModal() {
		this.sendDccDetailsViewMetric();
		this.activeModal.close('close');
	}

	@HostListener('document:keydown.escape', ['$event'])
	onClickEscape($event) {
		this.closeModal();
	}
}
