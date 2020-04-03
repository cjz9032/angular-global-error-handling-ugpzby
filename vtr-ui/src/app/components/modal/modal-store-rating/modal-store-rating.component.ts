import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { TaskAction } from 'src/app/services/metric/metrics.model';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faEllipsisH } from '@fortawesome/pro-light-svg-icons/faEllipsisH';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';

@Component({
	selector: 'vtr-modal-store-rating',
	templateUrl: './modal-store-rating.component.html',
	styleUrls: ['./modal-store-rating.component.scss'],
	animations: [
		trigger('hideToShow', [
			state('show', style({
				opacity: 1,
			})),
			state('hidden', style({
				opacity: 0,
			})),
			transition('hidden => show', [
				animate('0.2s')
			]),
			transition('show => hidden', [
				animate('0.1s')
			]),
		]),
		trigger('scaleTo1', [
			state('origin', style({
				transform: 'scale(1.25)'
			})),
			state('normal', style({
				transform: 'scale(1)'
			})),
			transition('origin => normal', [
				animate('0.2s')
			]),
			transition('normal => origin', [
				animate('0.1s')
			]),
		])
	]
})
export class ModalStoreRatingComponent implements OnInit {

	public faTimesCircle = faTimes;
	public faHeart = faHeart;
	public faEllipsisH = faEllipsisH;
	public faEnvelope = faEnvelope;
	private msStoreUtil: any = null;
	public redHeartHintVisible = false;
	public closeHintVisible = false;
	public elilipsisHintVisible = true;

	constructor(
		public activeModal: NgbActiveModal,
		private logger: LoggerService,
		private metrics: MetricService,
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
		if (this.msStoreUtil) {
			if (this.msStoreUtil.isMSStoreRatingSupported()) {
				this.logger.info('Launch MS rating without leaving Vantage.');
				const ret = await this.msStoreUtil.launchMSStoreRatingAsync();
				if (ret === 'failed') {
					this.logger.info(`Launch MS rating failed,Launch ms store to rate Vantage.`);
					await this.msStoreUtil.launchMSStoreToVantageAsync();
				}
				this.sendMSRatingResultMetrics(ret);
			}
			else {
				this.logger.info(`MS store rating not support, launch ms store to rate Vantage.`);
				await this.msStoreUtil.launchMSStoreToVantageAsync();
			}
		}
	}

	public async onBtnDislikeClicked($event) {
		this.activeModal.close(false);
		if (this.msStoreUtil) {
			if (this.msStoreUtil.isFeedbackHubSupported()) {
				const ret = await this.msStoreUtil.launchMSFeedback();
				if (!ret) {
					this.logger.info(`MS Feedback launch failed,Launch mail to comment Vantage.`);
					await this.msStoreUtil.emailToLenovo();
					return;
				}
				this.sendMsFeedbackLaunchedMetrics();
			} else {
				this.logger.info(`MS Feedback is not supported,Launch mail to comment Vantage.`);
				await this.msStoreUtil.emailToLenovo();
				this.sendDoEmailToLenovoMetrics();
			}
		}
	}

	public onBtnMouseEnter(arg) {
		if (arg === 'like') {
			this.showRedHeart();
		} else {
			this.showCloseHint();
		}
	}

	public onBtnMouseLeave() {
		this.showEllipsis();
	}

	private sendMSRatingResultMetrics(result: string) {
		const taskinfo = new TaskAction('StorRating-MSStoreRating', 1, '', result, 0);
		this.metrics.sendMetrics(taskinfo);
	}

	private sendMsFeedbackLaunchedMetrics() {
		const taskinfo = new TaskAction('StorRating-LaunchMSFeedback', 1, '', 'success', 0);
		this.metrics.sendMetrics(taskinfo);
	}

	private sendDoEmailToLenovoMetrics() {
		const taskinfo = new TaskAction('StorRating-LaunchEmailToLenovo', 1, '', 'success', 0);
		this.metrics.sendMetrics(taskinfo);
	}


	private resetHint() {
		this.closeHintVisible = false;
		this.redHeartHintVisible = false;
		this.elilipsisHintVisible = false;
	}

	private showRedHeart() {
		this.resetHint();
		this.redHeartHintVisible = true;
	}

	private showCloseHint() {
		this.resetHint();
		this.closeHintVisible = true;
	}

	private showEllipsis() {
		this.resetHint();
		this.elilipsisHintVisible = true;
	}

}
