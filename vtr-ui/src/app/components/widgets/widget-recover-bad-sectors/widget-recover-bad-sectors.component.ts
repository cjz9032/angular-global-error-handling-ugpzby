import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RecoverBadSectorsService } from 'src/app/services/hardware-scan/recover-bad-sectors.service';

@Component({
	selector: 'vtr-widget-recover-bad-sectors',
	templateUrl: './widget-recover-bad-sectors.component.html',
	styleUrls: ['./widget-recover-bad-sectors.component.scss']
})
export class WidgetRecoverBadSectorsComponent implements OnInit, OnDestroy {
	@Input() widgetId: string;
	@Input() title: string;
	@Input() description: string;
	@Input() disable = false;
	@Input() tooltipText: string;

	constructor(
		private rbsService: RecoverBadSectorsService,
		private router: Router
	) { }

	ngOnInit() { }

	ngOnDestroy() { }

	public onRecoverBadSectors() {
		this.router.navigate(['/hardware-scan']);
		if (this.rbsService) {
			this.rbsService.openRecoverBadSectorsModal();
		}
	}
}
