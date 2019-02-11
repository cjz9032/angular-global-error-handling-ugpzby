import {
	Component,
	OnInit,
	Input,
	ViewChild,
	Output,
	EventEmitter
} from '@angular/core';

@Component({
	selector: 'vtr-collapsible-container-item',
	templateUrl: './collapsible-container-item.component.html',
	styleUrls: ['./collapsible-container-item.component.scss']
})
export class CollapsibleContainerItemComponent implements OnInit {
	@ViewChild('childContent') childContent: any;

	@Input() readMoreText = "";
	@Input() rightImageSource = "";
	@Input() leftImageSource = "";
	@Input() header = "";
	@Input() subHeader = "";
	@Input() isCheckBoxVisible = false;
	@Input() isSwitchVisible = false;

	@Output() toggleOnOff = new EventEmitter<boolean>();
	@Output() readMoreClick = new EventEmitter<boolean>();
	@Output() tooltipClick = new EventEmitter<boolean>();
	@Output() checkBoxChange = new EventEmitter<boolean>();

	constructor() { }

	ngOnInit() {
		this.childContent = {};
		this.childContent.innerHTML = '';
	}

	public onOnOffChange($event) {
		this.toggleOnOff.emit($event);
	}

	public onReadMoreClick($event) {
		this.readMoreClick.emit($event);
	}

	public onTooltipClick($event) {
		this.tooltipClick.emit($event);
	}

	public onCheckBoxChange($event) {
		this.checkBoxChange.emit($event);
	}
}
