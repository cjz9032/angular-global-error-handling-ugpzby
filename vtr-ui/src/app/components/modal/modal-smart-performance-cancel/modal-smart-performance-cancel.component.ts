import { Component, OnInit, HostListener, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { Router } from '@angular/router';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-modal-smart-performance-cancel',
	templateUrl: './modal-smart-performance-cancel.component.html',
	styleUrls: ['./modal-smart-performance-cancel.component.scss'],
})
export class ModalSmartPerformanceCancelComponent implements OnInit {
	@Input() promptMsg = false;
	@Output() cancelRequested: EventEmitter<any> = new EventEmitter();

	constructor(
		public activeModal: NgbActiveModal,
		public smartPerformanceService: SmartPerformanceService,
		private router: Router,
		private localCacheService: LocalCacheService,
		private logger: LoggerService
	) { }
	private timerRef: any;
	public secondsCountdown = 9;
	public isLoading = false;

	ngOnInit() {
		// this.localCacheService.setLocalCacheValue(LocalStorageKey.IsSmartPerformanceForceClose, false);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.HasSubscribedScanCompleted, false);
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
			this.stopCountdown();
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
			this.stopCountdown();
		}
		try {
			this.localCacheService.setLocalCacheValue(LocalStorageKey.HasSubscribedScanCompleted, true);
			this.isLoading = true;
			const cancelScanFromService = await this.smartPerformanceService.cancelScan();
			this.logger.info('modal-smart-performance-cancel.cancelScan', cancelScanFromService);
			if (cancelScanFromService) {
				//  emiting cancel in smart performance scanning component.
				this.cancelRequested.emit();
				//  de-activates the pop-up,
				this.activeModal.close(true);

			}

		} catch (err) {
			this.logger.error('Error while leaving page', err.message);
		}
	}

}
