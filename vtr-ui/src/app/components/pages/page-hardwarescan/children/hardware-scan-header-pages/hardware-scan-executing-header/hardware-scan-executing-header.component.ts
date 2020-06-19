import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from '../../../../../../services/hardware-scan/hardware-scan.service';

@Component({
  selector: 'vtr-hardware-scan-executing-header',
  templateUrl: './hardware-scan-executing-header.component.html',
  styleUrls: ['./hardware-scan-executing-header.component.scss']
})
export class HardwareScanExecutingHeaderComponent implements OnInit {
	// Inputs
	@Input() percent = 0;
	@Input() title = '';
	@Input() subTitle = '';
	@Input() completed: boolean | undefined;
	@Input() disableCancel: boolean;
	@Input() disableButtonScan: boolean;

	// Metrics
	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	// Emitters
	@Output() checkCancel = new EventEmitter();
	@Output() startQuickScan = new EventEmitter();
	@Output() checkAnchor = new EventEmitter();

	public lastExecutedModule: string = '';

	constructor(private hardwareScanService: HardwareScanService) { }

	ngOnInit() { }

	onCancel() {
		this.checkCancel.emit();
	}

	public getDeviceTitle() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.hardwareScanService.getDeviceInRecover();
			}

			const module = this.hardwareScanService.getExecutingModule();
			if (module !== undefined) {
				this.lastExecutedModule = module;
				return module;
			} else {
				return this.lastExecutedModule;
			}
		}
	}

	public isRecoverExecuting() {
		return this.hardwareScanService.isRecoverExecuting();
	}
}
