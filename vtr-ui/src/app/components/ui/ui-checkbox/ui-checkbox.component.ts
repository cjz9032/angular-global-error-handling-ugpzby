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
	@Input() disabled = false;
	@Input() value: any;
	@Input() hasChild = false; // for ng-content
	@Input() metricsItem: string;
	@Input() isMetricsEnabled = false;
	@Output() toggle: EventEmitter<boolean> = new EventEmitter();

	constructor(private metrics: CommonMetricsService) { }

	ngOnInit() { }

	onChange(event) {
		const value = event.target.checked;
		this.checked = value;
		this.toggle.emit(value);
		if (this.isMetricsEnabled) {
			const itemName = this.metricsItem || `${this.componentId}_checkbox`;
			this.metrics.sendMetrics(value, itemName);
		}
	}

}
