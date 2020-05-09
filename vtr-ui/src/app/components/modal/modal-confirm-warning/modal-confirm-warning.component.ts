import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SmartPerformanceService } from "src/app/services/smart-performance/smart-performance.service";
import { LoggerService } from "src/app/services/logger/logger.service";

@Component({
	selector: "vtr-modal-confirm-warn",
	templateUrl: "./modal-confirm-warning.component.html",
	styleUrls: ["./modal-confirm-warning.component.scss"],
})
export class ModalConfirmWarning {
	constructor(
		private activeModal: NgbActiveModal,
		private smartPerformanceService: SmartPerformanceService,
		private logger: LoggerService
	) {}

	canLeave() {
		this.smartPerformanceService
			.cancelScan()
			.then((res) => {
				if (res) {
					this.logger.info(
						"Scan has been cancelled because user to navigate away"
					);
					return;
				}
			})
			.catch((error) => {
				this.logger.error("Error while leaving page", error);
			});
		this.activeModal.close(true);
	}

	close() {
		this.activeModal.close(false);
	}
}
