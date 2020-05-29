import { Component, OnInit, HostListener, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-modal-smart-performance-cancel',
	templateUrl: './modal-smart-performance-cancel.component.html',
	styleUrls: ['./modal-smart-performance-cancel.component.scss'],
})
export class ModalSmartPerformanceCancelComponent implements OnInit {
	@Input() promptMsg: boolean = false;
	@Output() cancelRequested: EventEmitter<any> = new EventEmitter();
	constructor(
		public activeModal: NgbActiveModal,
		public smartPerformanceService: SmartPerformanceService,
		private router: Router,
		private commonService: CommonService,
		private logger: LoggerService
	) { }
	private timerRef: any;
	public secondsCountdown = 9;
	public isLoading = false;

	ngOnInit() {
		// this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceForceClose, false);
		this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, false);
		this.timerRef = setInterval(() => {
			if (this.secondsCountdown-- === 0) {
				this.cancelScan();
			}
		}, 1000);
	}
	public closeModal() {
		if (this.timerRef) {
			this.stopCountdown();
		}
		this.activeModal.close(false);
	}

	onAgree() {
		if (this.timerRef) {
			this.stopCountdown()
		}
		this.closeModal();
	}

	private stopCountdown() {
		clearInterval(this.timerRef);
	}
	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.cancel-modal') as HTMLElement;
		modal.focus();
	}

	public async cancelScan() {
		if (this.timerRef) {
			this.stopCountdown()
		}
		try {
			this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, true);
			this.isLoading = true;
			const cancelScanFromService = await this.smartPerformanceService.cancelScan();
			this.logger.info('modal-smart-performance-cancel.cancelScan', cancelScanFromService);
			if (cancelScanFromService) {
				//  emiting cancel in smart performance scanning component.
				this.cancelRequested.emit();
				this.smartPerformanceService.scanningStopped.next(true)
				//  de-activates the pop-up,
				this.activeModal.close(true);
				//  if (this.promptMsg) {
				//   this.promptMsg = false;
				//  }

			}

		} catch (err) {
			this.logger.error('Error while leaving page', err.message);
		}
	}

}
