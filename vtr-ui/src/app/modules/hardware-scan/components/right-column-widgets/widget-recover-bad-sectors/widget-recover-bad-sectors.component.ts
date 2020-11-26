import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RecoverBadSectorsService } from 'src/app/modules/hardware-scan/services/recover-bad-sectors.service';

@Component({
	selector: 'vtr-widget-recover-bad-sectors',
	templateUrl: './widget-recover-bad-sectors.component.html',
	styleUrls: ['./widget-recover-bad-sectors.component.scss'],
})
export class WidgetRecoverBadSectorsComponent implements OnInit, OnDestroy {
	@Input() widgetId: string;
	@Input() title: string;
	@Input() description: string;
	@Input() disable = false;
	@Input() tooltipText: string;

	constructor(private rbsService: RecoverBadSectorsService) {}

	ngOnInit() {}

	ngOnDestroy() {}

	public onRecoverBadSectors() {
		if (this.rbsService) {
			this.rbsService.openRecoverBadSectorsModal();
		}
	}
}
