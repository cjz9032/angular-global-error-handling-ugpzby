import {
	Component,
	Inject,
	OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@lenovo/material/dialog';
import { TranslateService } from '@ngx-translate/core';

interface DialogData {
	title: string;
	subtitle: string;
	describe: string;
	buttonName: string;
	linkButtonName: string;
	closeButton: boolean;
}

@Component({
	selector: 'material-dialog',
	templateUrl: './material-dialog.component.html',
	styleUrls: ['./material-dialog.component.scss'],
})
export class MaterialDialogComponent implements OnInit {
	dialogData: DialogData;
	buttonId: '';
	linkButtonId: '';

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private translateService: TranslateService
	) {
		this.dialogData = data;
	}

	ngOnInit(): void {
		this.buttonId = this.translateService.instant(this.dialogData.buttonName);
		this.linkButtonId = this.dialogData.linkButtonName ? this.translateService.instant(this.dialogData.linkButtonName) : '';
	}
}
