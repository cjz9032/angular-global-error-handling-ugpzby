import { Component, OnInit, Input } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { isUndefined } from 'util';
import { CommonService } from 'src/app/services/common/common.service';
import { Gaming } from 'src/app/enums/gaming.enum';

@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: [ './widget-system-tools.component.scss' ]
})
export class WidgetSystemToolsComponent implements OnInit {
	@Input() title = '';
	public gamingProperties: any;
	// TODO: replace above line with all capablity model
	// public gamingProperties: any = new AllCapablityModel();

	constructor(private commonService: CommonService) {}

	ngOnInit() {
		// TODO: Get macrokey capblity from local storage.
		// set this.gamingProperties.<macroKey> = local storage value;

		this.commonService.notification.subscribe((response) => {
			if (response.type === Gaming.GamingCapablities && isUndefined(this.gamingProperties)) {
				this.gamingProperties = response.payload;
			}
		});
	}
}
