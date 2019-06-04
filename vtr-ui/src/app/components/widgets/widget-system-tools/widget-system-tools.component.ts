import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';

@Component({
	selector: 'vtr-widget-system-tools',
	templateUrl: './widget-system-tools.component.html',
	styleUrls: [ './widget-system-tools.component.scss' ]
})
export class WidgetSystemToolsComponent implements OnInit, AfterViewInit {
	@Input() title = '';
	private gamingProperties: any;

	constructor(private gamingAllCapabilitiesService: GamingAllCapabilitiesService) {}

	ngOnInit() {}

	ngAfterViewInit(): void {
		if (this.gamingAllCapabilitiesService.isShellAvailable) {
			this.gamingAllCapabilitiesService.gamingCapablityValues.subscribe((updatedValue) => {
				if (updatedValue !== undefined) {
					this.gamingProperties = updatedValue;
				}
			});
		}
	}
}
