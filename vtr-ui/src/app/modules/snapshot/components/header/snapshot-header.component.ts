import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SnapshotStatus } from 'src/app/modules/snapshot/enums/snapshot.enum';
import { SnapshotService } from '../../services/snapshot.service';

@Component({
	selector: 'vtr-snapshot-header',
	templateUrl: './snapshot-header.component.html',
	styleUrls: ['./snapshot-header.component.scss'],
})
export class SnapshotHeaderComponent implements OnInit {
	// Input
	@Input() disableSnapshotButton: boolean;
	@Input() disableBaselineButton: boolean;
	@Input() snapshotStatus: SnapshotStatus = SnapshotStatus.NotStarted;

	public showSnapshotInformation = true;

	constructor(private snapshotService: SnapshotService) { }

	ngOnInit() { }

	onTakeSnapshot() {
		this.showSnapshotInformation = false;
		this.disableSnapshotButton = true;
		this.disableBaselineButton = true;
		this.snapshotStatus = SnapshotStatus.SnapshotInProgress;
		// This is just to simulate a call on snapshotService
		this.snapshotService.getLoadProcessorsInfo()
		.then((async() => {
			await this.delay(5000);
		}))
		.finally(() =>
		{
			this.disableSnapshotButton = false;
			this.disableBaselineButton = false;
			this.snapshotStatus = SnapshotStatus.SnapshotCompleted;
		});
	}

	onReplaceBaseline() {
		this.showSnapshotInformation = false;
		this.disableSnapshotButton = true;
		this.disableBaselineButton = true;
		this.snapshotStatus = SnapshotStatus.BaselineInProgress;
		// This is just to simulate a call on snapshotService
		this.snapshotService.getLoadProcessorsInfo()
		.then((async() => {
			await this.delay(3000);
		}))
		.finally(() =>
		{
			this.disableSnapshotButton = false;
			this.disableBaselineButton = false;
			this.snapshotStatus = SnapshotStatus.BaselineCompleted;
		});
	}

	// Remove this code when implement Update method and Replace baseline method.
	delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
}
