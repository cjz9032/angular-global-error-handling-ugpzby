import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faSmileBeam } from '@fortawesome/pro-light-svg-icons/faSmileBeam';
import { faFrown } from '@fortawesome/pro-light-svg-icons/faFrown';
import { faTimesCircle } from '@fortawesome/pro-light-svg-icons/faTimesCircle';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-modal-store-rating',
	templateUrl: './modal-store-rating.component.html',
	styleUrls: ['./modal-store-rating.component.scss']
})
export class ModalStoreRatingComponent implements OnInit {

	public faSmileBeam = faSmileBeam;
	public faFrown = faFrown;
	public faTimesCircle = faTimesCircle;
	private msStoreUtil: any = null;

	constructor(
		public activeModal: NgbActiveModal,
		private logger: LoggerService,
	) {
		const win = window as any;
		if (win.VantageShellExtension) {
			this.msStoreUtil = win.VantageShellExtension.Utils.MSStore;
		}
	}

	ngOnInit(): void {
	}

	public onBtnCloseClicked($event) {
		this.activeModal.dismiss(false);
	}

	public async onBtnLikeClicked($event) {
		this.activeModal.close(true);

		if (this.msStoreUtil && this.msStoreUtil.isMSStoreRatingSupported()) {
			this.logger.info('Launch MS rating without leaving Vantage.');
			const ret = await this.msStoreUtil.launchMSStoreRatingAsync();
			if (ret) {
				return;
			}
		}
		this.logger.info(`Launch ms store to rate Vantage.`);
		await this.msStoreUtil.launchMSStoreToVantageAsync();
	}

	public async onBtnDislikeClicked($event) {
		this.activeModal.close(false);

		if (this.msStoreUtil && this.msStoreUtil.isFeedbackHubSupported()) {
			const ret = await this.msStoreUtil.launchMSFeedback();
			if (ret) {
				return;
			}
		}
		this.logger.info(`Launch mail to comment Vantage.`);
		await this.msStoreUtil.emailToLenovo();
	}

}
