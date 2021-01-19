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
		this.emitFn(0);
		this.dialogRef.close('close');
	}

	confirmFn() {
		this.emitFn(1);
		this.dialogRef.close('close');
	}

	cancelFn() {
		this.emitFn(2);
		this.dialogRef.close('close');
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
}
