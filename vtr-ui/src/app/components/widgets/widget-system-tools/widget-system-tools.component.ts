import { Component, OnInit, Input,AfterViewInit } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { isUndefined } from 'util';
@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: ['./widget-system-tools.component.scss']
})
export class WidgetSystemToolsComponent implements OnInit {

	@Input() title = '';
	public gamingProperties: any = {};

	constructor(private gamingAllCapabilitiesService: GamingAllCapabilitiesService) { }

	ngOnInit() {
	}
	ngAfterViewInit(): void {
		if (this.gamingAllCapabilitiesService.isShellAvailable) {
			this.gamingAllCapabilitiesService.gamingCapablityValues.subscribe((updatedValue) => {
				if (!isUndefined(updatedValue)) {
					this.gamingProperties = updatedValue;
				}
			});
		}
	}
}
