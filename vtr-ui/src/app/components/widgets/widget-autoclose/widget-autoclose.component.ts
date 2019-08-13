import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-widget-autoclose',
	templateUrl: './widget-autoclose.component.html',
	styleUrls: ['./widget-autoclose.component.scss']
})
export class WidgetAutocloseComponent implements OnInit {
	@Output() actionModal = new EventEmitter<any>();
	@Output() removeFromList = new EventEmitter<any>();
	@Input() turnOnACStatus: boolean;
	@Input() appListData: any[];
	constructor(private gamingAutoCloseService: GamingAutoCloseService) { }

	ngOnInit() {
	}

	// Open Target Modal
	public openAutoCloseModal() {
		this.actionModal.emit();
	}

	// Remove App from Autoclose List

	public removeApp(name: string, index: number) {
		this.removeFromList.emit({ name, index });
	}

}
