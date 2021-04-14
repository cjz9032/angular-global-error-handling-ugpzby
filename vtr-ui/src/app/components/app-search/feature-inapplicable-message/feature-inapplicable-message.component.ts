import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@lenovo/material/snack-bar';

@Component({
  selector: 'vtr-message-feature-inapplicable',
  templateUrl: './feature-inapplicable-message.component.html',
  styleUrls: ['./feature-inapplicable-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeatureInapplicableMessageComponent implements OnInit {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

    ngOnInit() {}
}
