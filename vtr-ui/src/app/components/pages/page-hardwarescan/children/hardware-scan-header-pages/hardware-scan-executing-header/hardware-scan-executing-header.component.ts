import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HardwareScanService } from '../../../../../../services/hardware-scan/hardware-scan.service';
import { TranslateService } from '@ngx-translate/core';

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

	public lastExecutedModule = '';

	constructor(
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService
	) { }

	ngOnInit() { }

	onCancel() {
		this.checkCancel.emit();
	}

	public getDeviceTitle() {
		if (this.hardwareScanService) {
			const module = this.hardwareScanService.getExecutingModule();
			if (module !== undefined) {
				// Gets the translation using the get() method as it's safer than instant(), as it's asynchronous and
				// does not depend on the translation files are already been loaded as the latter.
				// Besides, if the translation is not found (e.g. an old plugin is being used), returns the module,
				// mimicking the 'TranslateDefaultValueIfNotFoundPipe' behavior, as it could not be used here, once it neither
				// supports translation on .ts files nor translation with parameters.
				this.translate.get('hardwareScan.pluginTokens.' + module)
					.subscribe(translatedValue => this.lastExecutedModule = translatedValue ? translatedValue : module);
			}
			return this.lastExecutedModule;
		}
	}

	public isRecoverExecuting() {
		return this.hardwareScanService.isRecoverExecuting();
	}
}
