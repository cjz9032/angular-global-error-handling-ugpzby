import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'vtr-widget-autoclose',
	templateUrl: './widget-autoclose.component.html',
	styleUrls: [ './widget-autoclose.component.scss' ]
})
export class WidgetAutocloseComponent implements OnInit, OnChanges {
	@Output() actionModal = new EventEmitter<any>();
	@Output() removeFromList = new EventEmitter<any>();
	@Input() turnOnACStatus: boolean;
	@Input() appListData: any[];
	@Input() modalStatus: boolean = false;
	hoverEle = -1;
	constructor() {}

	ngOnInit() {}

	public openAutoCloseModal() {
		this.actionModal.emit();
	}

	ngOnChanges(changes: SimpleChanges): void {}

	public removeApp(name: string, index: number) {
		this.removeFromList.emit({ name, index });
		document.getElementById('addAutoCloseAppBtn').focus();
	}
}
