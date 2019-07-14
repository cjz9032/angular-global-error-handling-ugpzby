import { GamingAllCapabilities } from './../../../data-models/gaming/gaming-all-capabilities';
import { Component, OnInit, Input } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { isUndefined } from 'util';
import { CommonService } from 'src/app/services/common/common.service';
import { Gaming } from 'src/app/enums/gaming.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: [ './widget-system-tools.component.scss' ]
})
export class WidgetSystemToolsComponent implements OnInit {
	@Input() title = '';
	public gamingProperties: any = new GamingAllCapabilities();
	constructor(private commonService: CommonService, private gamingCapabilityService: GamingAllCapabilitiesService) {}

	ngOnInit() {
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			// console.log(response, '--------------==');
			 if (response.type === Gaming.GamingCapablities) {
				 console.log(`GAMINGCAPABLITIES in widget-system-tools.component`, response);
				 this.gamingProperties = response.payload;
			 }
		 });
		this.gamingProperties.macroKeyFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.macroKeyFeature
		);
		// this.commonService.notification.subscribe((response) => {
		// 	if (response.type === Gaming.GamingCapablities) {
		// 		this.gamingProperties = response.payload;
		// 	}
		// });
	}
}
