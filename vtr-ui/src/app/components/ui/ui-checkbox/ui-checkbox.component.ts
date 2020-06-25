import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';

@Component({
	selector: 'vtr-ui-checkbox',
	templateUrl: './ui-checkbox.component.html',
	styleUrls: ['./ui-checkbox.component.scss']
})
export class UiCheckboxComponent implements OnInit {

	@Input() componentId: string;
	@Input() ariaLabel: string;
	@Input() label: string;
	@Input() checked = false;
	@Input() indeterminate = false;
	@Input() disabled = false;
	@Input() value: any;
	@Input() hasChild = false; // for ng-content
	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() isMetricsEnabled = false;
	@Output() toggle: EventEmitter<boolean> = new EventEmitter();
	@Output() clickEvent: EventEmitter<number> = new EventEmitter<number>();

	constructor(private metrics: CommonMetricsService) { }
	ngOnInit() { }

	onClick(event) {
		this.clickEvent.emit(event.target.checked);
	}

	onChange(event) {
		const value = event.target.checked;
		this.checked = value;
		this.toggle.emit(value);
		if (this.isMetricsEnabled) {
			const itemName = this.metricsItem || `${this.componentId}`;
			this.metrics.sendMetrics(value, itemName, this.metricsParent);
		}
	}

}
