import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { isUndefined } from 'util';

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
	constructor(private gamingAutoCloseService: GamingAutoCloseService) {}

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
