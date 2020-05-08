import { Component, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-modal-smart-performance-cancel',
	templateUrl: './modal-smart-performance-cancel.component.html',
	styleUrls: ['./modal-smart-performance-cancel.component.scss']
})
export class ModalSmartPerformanceCancelComponent implements OnInit {
	// @Output() stopScanning = new EventEmitter();
	constructor(
		public activeModal: NgbActiveModal,
		public smartPerformanceService: SmartPerformanceService,
		private router: Router,
		private commonService: CommonService
	) { }
	private timerRef: any;
	public secondsCountdown = 9;

	ngOnInit() {
		this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceForceClose, false);
		this.timerRef = setInterval(() => {
			if (this.secondsCountdown-- === 0) {
				this.onAgree();
			}
		}, 1000);
	}
	public closeModal() {
		if (this.timerRef) {
			this.stopCountdown();
		}

		this.activeModal.close('close');
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
	cancelScan() {
		if (this.smartPerformanceService.isShellAvailable) {
			this.smartPerformanceService
				.cancelScan()
				.then((cancelScanFromService: any) => {

					if (cancelScanFromService) {
						// this.router.navigate(['support/smart-performance']);
						// this.stopScanning.emit();
						// this.router.navigateByUrl('/support/smart-performance?SPForceClose=true&d='+(new Date).getTime(), {skipLocationChange: false});
						// this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceForceClose, true);

					} else {
						// this.isScanning = false;
					}
				})
				.catch(error => {

				});
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceForceClose, true);
		this.activeModal.close('close');
	}
}
