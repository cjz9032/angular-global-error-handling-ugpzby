import { Component, OnInit } from '@angular/core';
import { SnapshotEnvironment } from '../../enums/snapshot.enum';
@Component({
	selector: 'vtr-snapshot-main',
	templateUrl: './snapshot-main.component.html',
	styleUrls: ['./snapshot-main.component.scss'],
})
export class SnapshotMainComponent implements OnInit {
	public snapshotEnvironment = SnapshotEnvironment;

	constructor() {}

	ngOnInit(): void {}
}
