import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-hardware-scan-wait-select-header',
	templateUrl: './hardware-scan-wait-select-header.component.html',
	styleUrls: ['./hardware-scan-wait-select-header.component.scss']
})

export class HardwareScanWaitSelectHeaderComponent implements OnInit {
	// Input
	@Input() disableButtonScan: boolean;

	// Emitters
	@Output() startQuickScan = new EventEmitter();
	@Output() checkAnchor = new EventEmitter();

	constructor() { }

	ngOnInit() { }

	onQuickScan() {
		this.startQuickScan.emit();
	}

	onAnchor() {
		this.checkAnchor.emit();
	}
}
