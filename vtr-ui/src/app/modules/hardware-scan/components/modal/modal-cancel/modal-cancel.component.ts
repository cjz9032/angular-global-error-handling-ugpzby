import {
	Component,
	OnInit,
	OnDestroy,
	Output,
	EventEmitter,
	Input,
	ViewChildren,
	ElementRef,
	AfterViewInit,
	QueryList,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-cancel',
	templateUrl: './modal-cancel.component.html',
	styleUrls: ['./modal-cancel.component.scss'],
})
export class ModalCancelComponent implements OnInit, AfterViewInit, OnDestroy {
	description: string = this.translate.instant('hardwareScan.cancelMayTakeSomeTime');
	isInCountdown = true;

	loading: boolean;

	private timerRef: any;
	private MS_INTERVAL = 1000;

	@Input() ItemParent: string;
	@Input() CancelItemName: string;
	@Input() ConfirmItemName: string;
	@Input() secondsCountdown = 9;

	@Output() cancelRequested: EventEmitter<any> = new EventEmitter();

	@ViewChildren('cancel_modal_ok') cancelModalOkListener: QueryList<ElementRef>;

	constructor(
		private translate: TranslateService,
		private dialogRef: MatDialogRef<ModalCancelComponent>
	) {}

	ngOnInit() {
		this.loading = false;

		this.timerRef = setInterval(() => {
			if (this.secondsCountdown-- === 0) {
				this.onAgree();
			}
		}, this.MS_INTERVAL);
	}

	ngAfterViewInit() {
		// Keep looking for the button
		this.cancelModalOkListener.changes.subscribe(() => {
			// When it appears, focus it using its id.
			// It's not possible to use the 'this.cancelModalOkListener.first' here,
			// once it's an Angular component and not a regular HTML element.
			if (this.cancelModalOkListener.length > 0) {
				document.getElementById('cancel_modal_ok').focus();
			}
		});
	}

	ngOnDestroy() {
		if (this.timerRef) {
			this.stopCountdown();
		}
	}

	public closeModal() {
		this.dialogRef.close('close');
	}

	onAgree() {
		this.loading = true;
		this.cancelRequested.emit();

		if (this.timerRef) {
			this.stopCountdown();
		}
	}

	private stopCountdown() {
		this.isInCountdown = false;
		clearInterval(this.timerRef);
	}

	public showProcessFinishedMessage() {
		this.stopCountdown();
		this.description = this.translate.instant('hardwareScan.processFinishedCannotBeCanceled');
	}
}
