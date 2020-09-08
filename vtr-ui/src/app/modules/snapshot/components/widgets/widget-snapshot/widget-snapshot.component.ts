import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vtr-widget-snapshot',
  templateUrl: './widget-snapshot.component.html',
  styleUrls: ['./widget-snapshot.component.scss']
})
export class WidgetSnapshotComponent implements OnInit {
	@Input() widgetId: string;
	@Input() title: string;
	@Input() description: string;
	@Input() tooltipText: string;

	constructor(private translate: TranslateService) { }

	ngOnInit(): void {
	}
}
