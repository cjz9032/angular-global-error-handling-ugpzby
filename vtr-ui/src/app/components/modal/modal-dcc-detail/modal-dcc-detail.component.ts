import {
	Component,
	OnInit,
	HostListener,
	AfterViewInit,
} from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-dcc-detail',
	templateUrl: './modal-dcc-detail.component.html',
	styleUrls: ['./modal-dcc-detail.component.scss'],
	providers: [TimerService],
})
export class ModalDccDetailComponent implements OnInit, AfterViewInit {
	metricClient: any;
	enterTime: number;
	metricsParent = '';

	dccTitle = this.translateService.instant('dcc.heroBanner.description').toUpperCase();

	constructor(
		public dialogRef: MatDialogRef<ModalDccDetailComponent>,
		vantageShellService: VantageShellService,
		private timerService: TimerService,
		private translateService: TranslateService,
		public commonService: CommonService
	) {
		this.metricClient = vantageShellService.getMetrics();
		this.metricsParent = 'dcc.detail';
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

	enableBatteryChargeThreshold() {
		this.dialogRef.close('enable');
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
				DocReadPosition =
					((dccBox.scrollTop + dccBox.offsetHeight) * 100) / dccContent.offsetHeight;
				DocReadPosition = Math.round(DocReadPosition);
			}
			const metricsData = {
				ItemType: 'DccDetailsView',
				ItemID: '',
				ItemParent: this.metricsParent,
				ItemCategory: '',
				Duration: this.timerService.stop(),
				DocReadPosition,
				MediaReadPosition: 0,
			};
			this.metricClient.sendAsync(metricsData);
		}
	}

	closeModal() {
		this.sendDccDetailsViewMetric();
		this.dialogRef.close('close');
	}

	@HostListener('document:keydown.escape', ['$event'])
	onClickEscape($event) {
		this.closeModal();
	}
}
