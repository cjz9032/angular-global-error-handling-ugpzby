import { Component, OnInit, HostListener, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: "vtr-modal-smart-performance-cancel",
	templateUrl: "./modal-smart-performance-cancel.component.html",
	styleUrls: ["./modal-smart-performance-cancel.component.scss"],
})
export class ModalSmartPerformanceCancelComponent implements OnInit {
	// @Output() stopScanning = new EventEmitter();
	@Input() promptMsg: boolean = false;
	constructor(
		public activeModal: NgbActiveModal,
		public smartPerformanceService: SmartPerformanceService,
		private router: Router,
		private commonService: CommonService,
		private logger: LoggerService
	) {}
	private timerRef: any;
	public secondsCountdown = 9;
	public isLoading = false;

	ngOnInit() {
		this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceForceClose, false);
		this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, false);
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
	@HostListener("window: focus")
	onFocus(): void {
		const modal = document.querySelector(".cancel-modal") as HTMLElement;
		modal.focus();
	}

	cancelScan() {
		if (this.smartPerformanceService.isShellAvailable) {
			this.isLoading = true;
			this.smartPerformanceService
				.cancelScan()
				.then((cancelScanFromService: any) => {
					if (cancelScanFromService) {
						this.isLoading = false;
						this.activeModal.close(true);
						if (this.promptMsg) {
							this.promptMsg = false;
						}
						// this.router.navigate(['support/smart-performance']);
						// this.stopScanning.emit();
						// this.router.navigateByUrl('/support/smart-performance?SPForceClose=true&d='+(new Date).getTime(), {skipLocationChange: false});
						// this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceForceClose, true);
					} 
					// else {
					// 	// this.isScanning = false;
					// }
				})
				.catch((error) => {
					this.logger.error("Error while leaving page", error.message);
				});
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceForceClose, true);
		this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, true);
		// this.activeModal.close('close');
	}
}
