import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalHardwareScanCustomizeComponent } from '../../../../../modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { ModalWaitComponent } from '../../../../../modal/modal-wait/modal-wait.component';
import { TranslateService } from '@ngx-translate/core';
import { TaskType, TaskStep } from 'src/app/enums/hardware-scan-metrics.enum';
import { ModalScheduleScanCollisionComponent } from '../../../../../modal/modal-schedule-scan-collision/modal-schedule-scan-collision.component';
import { TimerService } from 'src/app/services/timer/timer.service';

import { ExecuteHardwareScanService } from '../../../../../../services/hardware-scan/execute-hardware-scan/execute-hardware-scan.service';
import { HardwareScanService } from '../../../../../../services/hardware-scan/hardware-scan.service';

@Component({
  selector: 'vtr-hardware-scan-wait-select-header',
  templateUrl: './hardware-scan-wait-select-header.component.html',
  styleUrls: ['./hardware-scan-wait-select-header.component.scss']
})

export class HardwareScanWaitSelectHeaderComponent implements OnInit {
	// Emitters
	@Output() startQuickScan = new EventEmitter();
	@Output() checkAnchor = new EventEmitter();

	constructor(private executeScanService : ExecuteHardwareScanService) { }

	ngOnInit() { }

	onQuickScan() {
		this.startQuickScan.emit();
	}

	onAnchor() {
		this.checkAnchor.emit();
	}

	//Return the status of the quick and custom button
	public isButtonDisable() {
		if (this.executeScanService){
			return this.executeScanService.getIsButtonDisable();
		}
	}
}
