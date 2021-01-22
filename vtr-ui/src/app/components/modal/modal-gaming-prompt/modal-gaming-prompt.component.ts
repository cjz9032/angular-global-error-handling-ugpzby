import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-gaming-prompt',
	templateUrl: './modal-gaming-prompt.component.html',
	styleUrls: ['./modal-gaming-prompt.component.scss'],
})
export class ModalGamingPromptComponent implements OnInit {
	@Output() emitService = new EventEmitter();

	public info: any = {
		id: {
			section: '',
			headerText: '',
			closeButton: '',
			description: '',
			okButton: '',
			cancelButton: '',
		},
	};
	public isChecked: any;

	constructor(public dialogRef: MatDialogRef<ModalGamingPromptComponent>) { }

	ngOnInit() {
		setTimeout(() => {
			this.focusCloseButton();
		}, 230);
	}

	emitFn(info) {
		this.emitService.next(info);
	}

	closeModal() {
		this.dialogRef.close('close');
		this.dialogClosedHandler(0);
	}

	confirmFn() {
		this.dialogRef.close('close');
		this.dialogClosedHandler(1);
	}

	cancelFn() {
		this.dialogRef.close('close');
		this.dialogClosedHandler(2);
	}

	setNotAskAgain() {
		this.isChecked = !this.isChecked;
		this.emitFn(this.isChecked);
	}

	focusCloseButton() {
		const elem: HTMLElement = document.querySelector('.gaming-advanced-prompt-close');
		if (elem) {
			elem.focus();
		}
	}

	dialogClosedHandler(info: number) {
		let afterClosedSubscription = this.dialogRef.afterClosed().subscribe(() => {
			this.emitFn(info);
			afterClosedSubscription.unsubscribe();
		})
	}
}
