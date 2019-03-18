import {
	Component,
	OnInit,
	Input,
	ViewChild,
	Output,
	EventEmitter
} from '@angular/core';

@Component({
	selector: 'vtr-ui-row-switch',
	templateUrl: './ui-row-switch.component.html',
	styleUrls: ['./ui-row-switch.component.scss']
})
export class UiRowSwitchComponent implements OnInit {
	@ViewChild('childContent') childContent: any;

	// Use Fort Awesome Font Awesome Icon Reference Array (library, icon class) ['fas', 'arrow-right']
	@Input() rightIcon = [];
	@Input() leftIcon = [];
	@Input() showChildContent = false;
	@Input() readMoreText = '';
	@Input() title = '';
	@Input() caption = '';
	@Input() linkPath = '';
	@Input() linkText = '';
	@Input() isSwitchVisible = false;
	@Input() theme = 'white';
	@Input() resetText = '';
	@Input() isSwitchChecked = false;
	@Input() tooltipText = '';
	@Input() name = '';
	@Input() disabled = false;


	@Output() toggleOnOff = new EventEmitter<any>();
	@Output() readMoreClick = new EventEmitter<boolean>();
	@Output() tooltipClick = new EventEmitter<boolean>();
	@Output() resetClick = new EventEmitter<Event>();

	constructor() { }

	ngOnInit() {
		this.childContent = {};
		this.childContent.innerHTML = '';
	}

	public onOnOffChange($event: any) {
		this.toggleOnOff.emit($event);
	}

	public onReadMoreClick($event) {
		this.readMoreClick.emit($event);
	}

	public onRightIconClick($event) {
		this.tooltipClick.emit($event);
	}

	public onResetClick($event: Event) {
		this.resetClick.emit($event);
	}
}
