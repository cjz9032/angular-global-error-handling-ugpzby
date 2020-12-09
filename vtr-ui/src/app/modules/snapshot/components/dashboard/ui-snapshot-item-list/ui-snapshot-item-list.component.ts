import { Component, Input, OnInit } from '@angular/core';
import { SnapshotEnvironment, SnapshotModules } from '../../../enums/snapshot.enum';

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
		DisplayDevices: null,
		HardDrives: null,
		Keyboards: null,
		Memory: null,
		Motherboard: null,
		MouseDevices: null,
		Network: null,
		OperatingSystems: null,
		Printers: null,
		Processors: {
			BaselineDate: '12/04/2020 18:02:54',
			IsDifferent: true,
			Items: [
				{
					DeviceId: 'CPU0',
					DeviceTypeName: 'SystemInfoProcessors',
					IsDifferent: true,
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
							BaseValue: 'Intel(R) Celeron',
							CurrentValue: 'Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz',
							IsDifferent: true,
							PropertyName: 'Snapshot_Processor_Name'
						},
						{
							BaseValue: '2',
							CurrentValue: '8',
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
					IsDifferent: false,
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
							BaseValue: '256.00 KB',
							CurrentValue: '256.00 KB',
							IsDifferent: false,
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
					IsDifferent: false,
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
							BaseValue: '1.00 MB',
							CurrentValue: '1.00 MB',
							IsDifferent: false,
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
					IsDifferent: false,
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
							BaseValue: '8.00 MB',
							CurrentValue: '8.00 MB',
							IsDifferent: false,
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
			LastSnapshotDate: '12/04/2020 18:22:44'
		},
		Programs: null,
		ReturnCode: 2147483648,
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
		// Here is mocked, but it must have the correct calls and fill this structure
		Object.entries(modules).forEach(([key, value]) => {
			const propertyValue = value ?? '';

			const itemObject = {
				name: key,
				iconSrc: this.getModuleIcon(key),
				detailsExpanded: false,
				properties: propertyValue,
				isComponentLoaded: false,
			};

			// It's a mocked value only to show the changes in html
			if (key === 'Processors') {
				itemObject.isComponentLoaded = true;
			}

			this.itemsAttributes.push(itemObject);
		});
	}

	private hasModification(values) {
		// Must implement a call to return if a property was changed
		return false;
	}

	// Method to get correct icon
	private getModuleIcon(module: string): string {
		const moduleIcon = SnapshotModules[SnapshotModules[module]] ?? '';

		return moduleIcon === '' ? moduleIcon : 'assets/icons/snapshot/icon_' + moduleIcon.toLowerCase() + '.svg';
	}
}
