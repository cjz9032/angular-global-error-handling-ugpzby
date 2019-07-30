import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter
} from '@angular/core';

// @ts-ignore
@Component({
	selector: 'vtr-widget-switch-icon',
	templateUrl: './widget-switch-icon.component.html',
	styleUrls: ['./widget-switch-icon.component.scss']
})
export class WidgetSwitchIconComponent implements OnInit {
	@Input() title: string;
	@Input() iconDefinition: string;
	@Input() offIconDefinition: string; // when feature is off
	@Input() value = false;
	@Input() isBlocked = false;
	@Input() tooltipText = '';
	@Input() disable = false;
	@Input() metricsItem = '';
	@Input() isCamera = false;
	@Input() isLoading = true;
	@Output() toggle = new EventEmitter<boolean>();
	@Input() switchId: string;
	constructor() { }

	ngOnInit() {
		console.log(this.title, this.iconDefinition);
	}

	onChange(event: Event) {

		if (this.disable) {
			this.value = false;
			event.stopPropagation();
			return;
		}

		if (this.isCamera) {
			console.log('WIDGET SWITCH ICON VALUE', this.value);
			this.toggle.emit(this.value);
		} else {
			this.value = !this.value;
			console.log('WIDGET SWITCH ICON VALUE', this.value);
			this.toggle.emit(this.value);

		}
	}


}
