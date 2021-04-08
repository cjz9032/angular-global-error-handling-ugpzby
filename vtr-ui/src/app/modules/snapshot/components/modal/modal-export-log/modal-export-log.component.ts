import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';
import { ExportLogErrorStatus } from 'src/app/enums/export-log.enum';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-modal-export-log',
	templateUrl: './modal-export-log.component.html',
	styleUrls: ['./modal-export-log.component.scss'],
})
export class ModalExportLogComponent implements OnInit, OnDestroy {
	@Input() logPath = '';
	@Input() errorStatus: ExportLogErrorStatus;

	public enumExportLogErrorStatus = ExportLogErrorStatus;

	constructor(
		public dialogRef: MatDialogRef<ModalExportLogComponent>,
		private deviceService: DeviceService
	) {}

	ngOnInit() {
		this.disableBackgroundNavigation(document);
	}

	ngOnDestroy() {
		this.reEnableBackgroundNavigation(document);
	}

	onClosing() {
		this.dialogRef.close();
	}

	openWindowsSettings() {
		this.deviceService.launchUri('ms-settings:privacy-broadfilesystemaccess');
	}

	disableBackgroundNavigation(document) {
		const modalNodes = Array.from(document.querySelectorAll('dialog *'));

		// by only finding elements that do not have tabindex="-1" we ensure we don't
		// corrupt the previous state of the element if a modal was already open
		const nonModalNodes = document.querySelectorAll('body *:not(dialog):not([tabindex="-1"])');

		for (const node of nonModalNodes) {
			if (!modalNodes.includes(node)) {
				// save the previous tabindex state so we can restore it on close
				node.prevTabindex = node.getAttribute('tabindex');
				node.setAttribute('tabindex', -1);

				// tabindex=-1 does not prevent the mouse from focusing the node (which
				// would show a focus outline around the element). prevent this by disabling
				// outline styles while the modal is open
				// @see https://www.sitepoint.com/when-do-elements-take-the-focus/
				node.style.outline = 'none';
			}
		}
	}

	reEnableBackgroundNavigation(document) {
		const nonModalNodes = document.querySelectorAll('body *:not(dialog)');

		// restore or remove tabindex from nodes
		for (const node of nonModalNodes) {
			if (node.prevTabindex) {
				node.setAttribute('tabindex', node.prevTabindex);
				node.prevTabindex = null;
			} else {
				node.removeAttribute('tabindex');
			}
			node.style.outline = null;
		}
	}
}
