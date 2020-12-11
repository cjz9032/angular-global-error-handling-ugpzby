import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-ui-snapshot-item-list',
	templateUrl: './ui-snapshot-item-list.component.html',
	styleUrls: ['./ui-snapshot-item-list.component.scss'],
})
export class UiSnapshotItemListComponent implements OnInit {
	@Input() hostPage: string;
	@Input() title: string;
	@Input() snapshotComponents: Array<any>;

	constructor() {}

	ngOnInit(): void {}
}
