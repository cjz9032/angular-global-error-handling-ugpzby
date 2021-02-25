import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@lenovo/material/snack-bar';

@Component({
  selector: 'vtr-custom-snack-bar',
  templateUrl: './custom-snack-bar.component.html',
  styleUrls: ['./custom-snack-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomSnackBarComponent implements OnInit {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
	public snackBarRef: MatSnackBarRef<CustomSnackBarComponent>) {}

    ngOnInit() {}

	@HostListener('click')
	onClickAnywhare() {
		this.snackBarRef.dismiss();
	}
}
