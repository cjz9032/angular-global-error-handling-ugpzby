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
	@Input() value: boolean = false;
	@Input() isBlocked = false;
	@Input() tooltipText = '';
	@Input() disable = false;
	@Input() metricsItem = '';
	@Input() isCamera = false;
	@Input() isLoading = true;
	@Output() toggle = new EventEmitter<boolean>();
	@Input() switchId: string;
	@Input() hideOnOffLabel = false;
	@Input() buttonRole: string;
	constructor() { }

	ngOnInit() {
	}

	onChange(event: Event) {

		if (this.disable || this.isLoading) {
			this.value = false;
			// event.stopPropagation();
			return;
		}

		if (this.isCamera) {
			this.toggle.emit(this.value);
		} else {
			this.value = !this.value;
			this.toggle.emit(this.value);

		}
	}
	findId(value, disable) {
		if (value && !disable) {
			return 'qs-' + this.switchId + '-switch-on-state';
		} else if (!value && !disable) {
			return 'qs-' + this.switchId + '-switch-off-state';
		} else {
			return 'qs-' + this.switchId + '-switch-disable-state';
		}

	}

}
