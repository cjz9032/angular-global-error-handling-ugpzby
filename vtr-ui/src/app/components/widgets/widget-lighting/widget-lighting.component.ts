import { GamingAllCapabilitiesService } from './../../../services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-lighting',
	templateUrl: './widget-lighting.component.html',
	styleUrls: [ './widget-lighting.component.scss' ]
})
export class WidgetLightingComponent implements OnInit {
	public response: any;
	@Input() title = '';

	constructor(
		private gamingLightingService: GamingLightingService,
		private gamingAllCapabilities: GamingAllCapabilitiesService
	) {}

	ngOnInit() {
		this.getGaminagLightingCapabilities();
	}
	public getGaminagLightingCapabilities() {
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService.getLightingCapabilities().then((response: any) => {
				console.log(
					'gaming Lighting Capabilities js bridge ------------------------>',
					JSON.stringify(response)
				);
			});
		}
	}
}
