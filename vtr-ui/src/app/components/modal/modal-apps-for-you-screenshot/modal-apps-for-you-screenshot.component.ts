import { Component, OnInit, OnDestroy, AfterViewInit, Input, HostListener } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-apps-for-you-screenshot',
	templateUrl: './modal-apps-for-you-screenshot.component.html',
	styleUrls: ['./modal-apps-for-you-screenshot.component.scss'],
})
export class ModalAppsForYouScreenshotComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() image: string;

	public metricsParent = 'AppsForYou';

	constructor(
		public dialogRef: MatDialogRef<ModalAppsForYouScreenshotComponent>
	) { }

	ngOnInit() { }

	ngAfterViewInit() { }

	ngOnDestroy() { }

	closeModal() {
		this.dialogRef.close('close');
	}

	@HostListener('document:keydown.escape', ['$event'])
	onPressEscape(event: KeyboardEvent) {
		this.closeModal();
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.apps-for-you-dialog') as HTMLElement;
		modal.focus();
	}
}
