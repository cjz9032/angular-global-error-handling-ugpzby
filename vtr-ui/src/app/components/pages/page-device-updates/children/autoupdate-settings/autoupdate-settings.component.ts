import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base.component';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'vtr-autoupdate-settings',
  templateUrl: './autoupdate-settings.component.html',
  styleUrls: ['./autoupdate-settings.component.scss']
})
export class AutoupdateSettingsComponent extends BaseComponent implements OnInit {

	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];

	@Output() toggleOnOff = new EventEmitter<any>();

	constructor(private deviceService: DeviceService) {
		super();
	}

	ngOnInit() { }

	public onToggleOnOff($event: any) {
		this.toggleOnOff.emit($event);
	}

	public onLinkClick(path: string) {
		if (path && path.length > 0) {
			this.deviceService.launchUri(path);
		}
	}

	onQuestionMarkClick(tooltip) {
		if (tooltip) {
			if (tooltip.isOpen()) {
				tooltip.close();
			} else {
				tooltip.open();
			}
		}
	}
}


