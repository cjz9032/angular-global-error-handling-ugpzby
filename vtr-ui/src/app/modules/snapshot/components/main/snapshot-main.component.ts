import { Component, OnInit } from '@angular/core';
import { SnapshotStatus } from '../../enums/snapshot.enum';
import { SnapshotService } from '../../services/snapshot.service';
@Component({
	selector: 'vtr-snapshot-main',
	templateUrl: './snapshot-main.component.html',
	styleUrls: ['./snapshot-main.component.scss'],
})
export class SnapshotMainComponent implements OnInit {
	public softwareComponents: Array<any>;
	public hardwareComponents: Array<any>;

	constructor(private snapshotService: SnapshotService) {
		this.softwareComponents = [];
		this.hardwareComponents = [];
	}

	ngOnInit(): void {
		this.snapshotService.getSoftwareComponentsList().forEach((key) => {
			this.softwareComponents.push({
				name: key,
				content: this.snapshotService.snapshotInfo[key],
			});
		});

		this.snapshotService.getHardwareComponentsList().forEach((key) => {
			this.hardwareComponents.push({
				name: key,
				content: this.snapshotService.snapshotInfo[key],
			});
		});
	}

	public isButtonEnabled(): boolean {
		const statesToEnable = [
			SnapshotStatus.notStarted,
			SnapshotStatus.snapshotCompleted,
			SnapshotStatus.baselineCompleted,
		];
		return statesToEnable.includes(this.snapshotService.snapshotStatus);
	}
}
