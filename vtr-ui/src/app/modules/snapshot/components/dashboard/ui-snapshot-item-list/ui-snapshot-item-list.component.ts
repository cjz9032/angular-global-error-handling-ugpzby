import { Component, Input, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SnapshotEnvironment, SnapshotModules } from '../../../enums/snapshot.enum';
import { SnapshotService } from '../../../services/snapshot.service';

@Component({
	selector: 'vtr-ui-snapshot-item-list',
	templateUrl: './ui-snapshot-item-list.component.html',
	styleUrls: ['./ui-snapshot-item-list.component.scss'],
})
export class UiSnapshotItemListComponent implements OnInit {
	@Input() snapshotEnvironment = SnapshotEnvironment.Hardware;

	// Mocked data until has no call to bridge
	public items: any = {
		CdRomDrives: null,
		DateOfCreation: '12/02/2020 16:10:15',
		DisplayDevices: null,
		HardDrives: null,
		Keyboards: null,
		Memory: null,
		Motherboard: null,
		MouseDevices: null,
		Network: null,
		OperatingSystems: null,
		Printers: null,
		Processors: [
			{
				DeviceId: 'CPU0',
				DeviceTypeName: 'SystemInfoProcessors',
				Properties: [
					{
						BaseValue: 'GenuineIntel',
						CurrentValue: 'GenuineIntel',
						IsDifferent: false,
						PropertyName: 'Snapshot_Processor_Manufacturer'
					},
					{
						BaseValue: '4',
						CurrentValue: '4',
						IsDifferent: false,
						PropertyName: 'Snapshot_Processor_Cores'
					},
					{
						BaseValue: 'Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz',
						CurrentValue: 'Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz',
						IsDifferent: false,
						PropertyName: 'Snapshot_Processor_Name'
					},
					{
						BaseValue: '8',
						CurrentValue: '50',
						IsDifferent: true,
						PropertyName: 'SystemInfoProcessorsThreads'
					},
					{
						BaseValue: '198',
						CurrentValue: '198',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsFamily'
					},
					{
						BaseValue: '',
						CurrentValue: '',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsRevision'
					}
				],
				SubDevices: null
			},
			{
				DeviceId: 'L1 Cache-Unified',
				DeviceTypeName: 'L1 Cache',
				Properties: [
					{
						BaseValue: 'L1 Cache',
						CurrentValue: 'L1 Cache',
						IsDifferent: false,
						PropertyName: 'CACHE'
					},
					{
						BaseValue: '3',
						CurrentValue: '3',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsLevel'
					},
					{
						BaseValue: 'Unified',
						CurrentValue: 'Unified',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsType'
					},
					{
						BaseValue: '256,00 KB',
						CurrentValue: '256.00 KB',
						IsDifferent: true,
						PropertyName: 'SystemInfoProcessorsSize'
					},
					{
						BaseValue: '8 way Set Associative',
						CurrentValue: '8 way Set Associative',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsAssociativity'
					}
				],
				SubDevices: null
			},
			{
				DeviceId: 'L2 Cache-Unified',
				DeviceTypeName: 'L2 Cache',
				Properties: [
					{
						BaseValue: 'L2 Cache',
						CurrentValue: 'L2 Cache',
						IsDifferent: false,
						PropertyName: 'CACHE'
					},
					{
						BaseValue: '4',
						CurrentValue: '4',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsLevel'
					},
					{
						BaseValue: 'Unified',
						CurrentValue: 'Unified',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsType'
					},
					{
						BaseValue: '1,00 MB',
						CurrentValue: '1.20 MB',
						IsDifferent: true,
						PropertyName: 'SystemInfoProcessorsSize'
					},
					{
						BaseValue: '4 way Set Associative',
						CurrentValue: '4 way Set Associative',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsAssociativity'
					}
				],
				SubDevices: null
			},
			{
				DeviceId: 'L3 Cache-Unified',
				DeviceTypeName: 'L3 Cache',
				Properties: [
					{
						BaseValue: 'L3 Cache',
						CurrentValue: 'L3 Cache',
						IsDifferent: false,
						PropertyName: 'CACHE'
					},
					{
						BaseValue: '5',
						CurrentValue: '5',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsLevel'
					},
					{
						BaseValue: 'Unified',
						CurrentValue: 'Unified',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsType'
					},
					{
						BaseValue: '8,00 MB',
						CurrentValue: '1900 MB',
						IsDifferent: true,
						PropertyName: 'SystemInfoProcessorsSize'
					},
					{
						BaseValue: '16 way Set Associative',
						CurrentValue: '16 way Set Associative',
						IsDifferent: false,
						PropertyName: 'SystemInfoProcessorsAssociativity'
					}
				],
				SubDevices: null
			}
		],
		Programs: null,
		ReturnCode: 536870912,
		SoundCards: null,
		StartupPrograms: null,
		VideoCards: null,
		WebBrowsers: null
	};
	public itemsAttributes = new Array();

	constructor() { }

	ngOnInit(): void {
		if (this.snapshotEnvironment === SnapshotEnvironment.Software) {
			// Here there must be implemented a call to the correct objects contruction
			this.getSoftwareModulesToSnapshot();
		} else {
			// Call getHardwareModulesToSnapshot must be here
			this.getHardwareModulesToSnapshot();
		}

	}

	private getSoftwareModulesToSnapshot() {
		// Do correct calls to get software modules
		// Mocked call
		this.getModulesToSnapshot(this.items);
	}

	private getHardwareModulesToSnapshot() {
		// Do correct calls to get hardware modules
		// Mocked call
		this.getModulesToSnapshot(this.items);
	}

	private getModulesToSnapshot(modules) {
		// A mock is implemented, but it must have the correct calls and fill this structure
		Object.entries(modules).forEach(([key, value]) => {
			const itemObject = {
				name: key,
				iconSrc: this.getModuleIcon(key),
				detailsExpanded: false,
				hasModification: this.hasModification(value),
				properties: value,
				isComponentLoaded: false,
			};

			// It's a mocked value only to show the changes in html
			if (key === 'Processors') {
				itemObject.isComponentLoaded = true;
				itemObject.hasModification = true;
			}

			this.itemsAttributes.push(itemObject);
		});
	}

	private hasModification(values) {
		// It must implement call to get if a property was changed
		return false;
	}

	// Method to get correct icon
	private getModuleIcon(module: string): string {
		// Mocked call until the icons were not able to download
		module = 'Processors'.toLowerCase();
		return 'assets/icons/snapshot/icon_processors.svg';

		// return 'assets/icons/snapshot/icon_' + SnapshotModules[module] + '.svg';
	}
}
