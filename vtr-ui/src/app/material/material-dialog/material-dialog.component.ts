import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@lenovo/material/dialog';
import { DialogData } from './material-dialog.interface';

@Component({
	selector: 'material-dialog',
	templateUrl: './material-dialog.component.html',
	styleUrls: ['./material-dialog.component.scss'],
})
export class MaterialDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {}
}
