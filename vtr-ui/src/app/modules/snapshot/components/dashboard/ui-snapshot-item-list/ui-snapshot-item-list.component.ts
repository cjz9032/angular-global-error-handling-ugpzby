import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SnapshotService } from '../../../services/snapshot.service';

interface ModulesProperties {
	src: string;
	alt: string;
}

@Component({
	selector: 'vtr-ui-snapshot-item-list',
	templateUrl: './ui-snapshot-item-list.component.html',
	styleUrls: ['./ui-snapshot-item-list.component.scss'],
})
export class UiSnapshotItemListComponent implements OnInit {
	@Input() componentId: string;
	@Input() items: Array<any> = [{
		icon: 'cpu',
		name: 'descricao',
		detailsExpanded: false,
		module: 'cpu',
		details: [ 1, 2, 3],
	},
	{
		icon: 'motherboard',
		detailsExpanded: false,
		module: 'motherboard'
	},
	{
		icon: 'memory',
		name: 'memoria',
		detailsExpanded: false,
		module: 'memory'
	},];

	public isComponentsLoaded = false;
	public modulesAttributes: Map<string, ModulesProperties> =  new Map<string, ModulesProperties>([
		['cpu',  { src: 'assets/icons/hardware-scan/icon_hardware_processor.svg', alt: 'cpu' }],
		['memory', { src: 'assets/icons/hardware-scan/icon_hardware_memory.svg', alt: 'memory' }],
		['motherboard', { src: 'assets/icons/hardware-scan/icon_hardware_motherboard.svg', alt: 'motherboard' }],
		['pci_express', { src: 'assets/icons/hardware-scan/icon_hardware_pci_desktop.svg', alt: 'pci_express' }],
		['pci_express_laptop', { src: 'assets/icons/hardware-scan/icon_hardware_pci_laptop.svg', alt: 'pci_express' }],
		['wireless', { src: 'assets/icons/hardware-scan/icon_hardware_wireless.svg', alt: 'wireless' }],
		['storage', { src: 'assets/icons/hardware-scan/icon_hardware_hdd.svg', alt: 'storage' }],
	]);

	constructor(
		private snapshotService: SnapshotService,
		private logger: LoggerService) { }

	ngOnInit(): void { }

	private loadComponents() {
		if (this.snapshotService) {
			try {
				this.snapshotService.getLoadCdRomDrivesInfo();

			} catch (error) {
				this.logger.exception('Could not load all snapshot information', error);
			}
		} else {
			this.logger.error('Could not load all snapshot information');
		}
	}
}
