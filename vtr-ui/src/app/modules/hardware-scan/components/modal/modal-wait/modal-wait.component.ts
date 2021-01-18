import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';
import { Observable } from 'rxjs';

@Component({
	selector: 'vtr-modal-wait',
	templateUrl: './modal-wait.component.html',
	styleUrls: ['./modal-wait.component.scss'],
})
export class ModalWaitComponent implements OnInit, OnDestroy {
	private shouldCloseModalSubscription: any;

	@Input() modalTitle: string;
	@Input() modalDescription: string;
	@Input() shouldCloseModal: Observable<boolean>;

	@Input() ItemParent: string;
	@Input() CancelItemName: string;

	constructor(
		private dialogRef: MatDialogRef<ModalWaitComponent>,
	) { }

	ngOnInit() {
		this.shouldCloseModalSubscription = this.shouldCloseModal.subscribe((result) => {
			if (result) {
				this.closeModal();
			}
		});
	}

	ngOnDestroy() {
		if (this.shouldCloseModalSubscription) {
			this.shouldCloseModalSubscription.unsubscribe();
		}
	}

	public closeModal() {
		this.dialogRef.close();
	}
}
