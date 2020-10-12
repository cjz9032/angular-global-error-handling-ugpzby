import {
	Component,
	Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@lenovo/material/dialog';

interface DialogData {
	title: string;
	subtitle: string;
	description: string;
	buttonName: string;
	linkButtonName: string;
	closeButton: boolean;
}

@Component({
	selector: 'material-dialog',
	templateUrl: './material-dialog.component.html',
	styleUrls: ['./material-dialog.component.scss'],
})
export class MaterialDialogComponent {
	dialogData: DialogData;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {
		this.dialogData = data;
	}
}
