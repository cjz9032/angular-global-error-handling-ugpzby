import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SnapshotService } from '../snapshot/services/snapshot.service';

@Component({
  selector: 'vtr-page-snapshot',
  templateUrl: './page-snapshot.component.html',
  styleUrls: ['./page-snapshot.component.scss']
})
export class PageSnapshotComponent implements OnInit {

	@Output() installedProgramInfo: EventEmitter<any> = new EventEmitter();

	constructor(private snapshotService: SnapshotService) { }

	ngOnInit(): void {
	}

	public onInstalledProgramInfo() {
		if (this.snapshotService) {
			this.installedProgramInfo.emit();
		}
	}

}
