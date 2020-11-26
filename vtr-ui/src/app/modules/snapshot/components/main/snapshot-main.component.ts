import { Component, OnInit, Input } from '@angular/core';
import { SnapshotService } from '../../services/snapshot.service';

@Component({
	selector: 'vtr-snapshot-main',
	templateUrl: './snapshot-main.component.html',
	styleUrls: ['./snapshot-main.component.scss'],
})
export class SnapshotMainComponent implements OnInit {
	@Input() snapshots: any;
	@Input() componentId: string;

	constructor(private snapshotService: SnapshotService) {}

	ngOnInit(): void {}
}
