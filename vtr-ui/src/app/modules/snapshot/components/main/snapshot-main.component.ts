import { Component, OnInit } from '@angular/core';
import {
	SnapshotComponentTypes,
	SnapshotHardwareComponents,
	SnapshotSoftwareComponents,
} from '../../enums/snapshot.enum';
import { SnapshotService } from '../../services/snapshot.service';
@Component({
	selector: 'vtr-snapshot-main',
	templateUrl: './snapshot-main.component.html',
	styleUrls: ['./snapshot-main.component.scss'],
})
export class SnapshotMainComponent implements OnInit {
	componentTypeEnum = SnapshotComponentTypes;
	public softwareComponents: Array<any>;
	public hardwareComponents: Array<any>;

	constructor(private snapshotService: SnapshotService) {
		this.softwareComponents = [];
		this.hardwareComponents = [];
	}

	ngOnInit(): void {
		SnapshotSoftwareComponents.values().forEach((key) => {
			this.softwareComponents.push({
				name: key,
				content: this.snapshotService.snapshotInfo[key],
			});
		});

		SnapshotHardwareComponents.values().forEach((key) => {
			this.hardwareComponents.push({
				name: key,
				content: this.snapshotService.snapshotInfo[key],
			});
		});
	}
}
