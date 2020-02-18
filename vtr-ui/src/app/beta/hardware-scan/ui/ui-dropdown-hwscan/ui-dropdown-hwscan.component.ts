import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-ui-dropdown-hwscan',
	templateUrl: './ui-dropdown-hwscan.component.html',
	styleUrls: ['./ui-dropdown-hwscan.component.scss'],
	providers: [NgbDropdownConfig]
})
export class UiDropdownHwscanComponent implements OnInit {

	constructor(config: NgbDropdownConfig) {
		config.placement = 'top-left';
		config.autoClose = true;
	}



	@Input() selectedItem: string;

	@Input() icon: string;
	@Input() title: string;
	@Input() subtitle: string;
	@Input() items: any[];
	@Input() nrSelect: any;
	@Input() isSmall: boolean;
	subIsLarge = false;


	@Output() selectedOption: EventEmitter<any> = new EventEmitter<any>();

	ngOnInit() {
		if (this.subtitle) {
			if (this.subtitle.length > 20) {
				this.subIsLarge = true;
			}
		}
	}

	selected() {
        this.selectedOption.emit(this.nrSelect);
    }

	select(choice: string) {
        this.selectedItem = choice;
        this.selectedOption.emit(choice);
    }
}
