import { Component, Input, OnInit } from '@angular/core';
import {
	SnapshotHardwareComponents,
	SnapshotSoftwareComponents,
} from '../../../enums/snapshot.enum';

@Component({
	selector: 'vtr-ui-snapshot-item-list',
	templateUrl: './ui-snapshot-item-list.component.html',
	styleUrls: ['./ui-snapshot-item-list.component.scss'],
})
export class UiSnapshotItemListComponent implements OnInit {
	@Input() hostPage: string;
	@Input() title: string;
	@Input() snapshotComponents: Array<any>;
	@Input() metricsParent: string;
	@Input() componentType: string;

	private itemsMetricsName = new Map<any, string>([
		[SnapshotHardwareComponents[SnapshotHardwareComponents.DisplayDevices], 'Display'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.HardDrives], 'HardDrive'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.Keyboards], 'Keyboard'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.Memory], 'Memory'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.Motherboard], 'Motherboard'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.MouseDevices], 'Mouse'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.Network], 'NetworkCard'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.CdRomDrives], 'OpticalDrives'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.Printers], 'Printer'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.Processors], 'Processor'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.SoundCards], 'SoundCard'],
		[SnapshotHardwareComponents[SnapshotHardwareComponents.VideoCards], 'VideoCard'],
		[SnapshotSoftwareComponents[SnapshotSoftwareComponents.Programs], 'InstalledPrograms'],
		[
			SnapshotSoftwareComponents[SnapshotSoftwareComponents.OperatingSystems],
			'OperatingSystem',
		],
		[SnapshotSoftwareComponents[SnapshotSoftwareComponents.StartupPrograms], 'StartupPrograms'],
		[SnapshotSoftwareComponents[SnapshotSoftwareComponents.WebBrowsers], 'WebBrowsers'],
	]);

	constructor() {}

	ngOnInit(): void {}

	public getMetricsName(itemName: any): string {
		return this.itemsMetricsName.get(itemName) || itemName;
	}
}
