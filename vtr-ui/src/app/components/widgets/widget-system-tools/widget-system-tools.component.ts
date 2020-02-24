import { GamingAllCapabilities } from './../../../data-models/gaming/gaming-all-capabilities';
import { Component, OnInit, Input } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { isUndefined } from 'util';
import { CommonService } from 'src/app/services/common/common.service';
import { Gaming } from 'src/app/enums/gaming.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';

@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: ['./widget-system-tools.component.scss']
})
export class WidgetSystemToolsComponent implements OnInit {
	@Input() title = '';
	showHWScanMenu: boolean = false;
	public gamingProperties: any = new GamingAllCapabilities();
	constructor(
		private commonService: CommonService, 
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private hardwareScanService: HardwareScanService
	) { }

	ngOnInit() {
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.gamingProperties = response.payload;
			}
		});
		this.gamingProperties.macroKeyFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.macroKeyFeature
		);

		// if (this.hardwareScanService && this.hardwareScanService.isAvailable) {
		// 	this.hardwareScanService.isAvailable()
		// 		.then((isAvailable: any) => {
		// 			this.showHWScanMenu = isAvailable;
		// 		})
		// 		.catch(() => {
		// 			this.showHWScanMenu = false;
		// 		});
		// }
	}
}
