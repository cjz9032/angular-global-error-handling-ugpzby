import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-widget-recover-bad-sectors',
	templateUrl: './widget-recover-bad-sectors.component.html',
	styleUrls: ['./widget-recover-bad-sectors.component.scss']
})
export class WidgetRecoverBadSectorsComponent implements OnInit {

	@Input() widgetId: string;
	@Input() title: string;
	@Input() description: string;
	@Input() recoverPath: string;
	@Input() disable = false;
	@Input() tooltipText: string;
	@Input() onClick: () => void;

	@Output() buttonClicked: EventEmitter<any> = new EventEmitter();

	constructor() { }

	ngOnInit() { }

	public onRecoverButtonClick(): void {
		this.buttonClicked.emit();
	}
}
