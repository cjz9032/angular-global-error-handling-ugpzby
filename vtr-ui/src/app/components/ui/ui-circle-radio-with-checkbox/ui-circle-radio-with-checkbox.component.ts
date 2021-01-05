import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { UICustomRadio } from '../ui-custom-radio/ui-custom-radio';

@Component({
	selector: 'vtr-ui-circle-radio-with-checkbox',
	templateUrl: './ui-circle-radio-with-checkbox.component.html',
	styleUrls: ['./ui-circle-radio-with-checkbox.component.scss'],
})
export class UiCircleRadioWithCheckboxComponent
	extends UICustomRadio
	implements OnInit, AfterViewInit {
	@Input() tooltip: string;
	@Input() disabled = false;
	@Input() theme: string;
	@Input() processIcon = false;
	@Input() textId: string;
	@Input() customIcon = '';
	@Input() hideIcon = false;
	@Input() processLabel = true;
	@Input() sendMetrics = true;
	@Output() optionChange: EventEmitter<any> = new EventEmitter();

	ngAfterViewInit(): void {
		super.ngAfterViewInit(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}
	constructor(logger: LoggerService, metrics: MetricService) {
		super(logger, metrics);
	}

	ngOnInit() {
		super.ngOnInit(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}

	onChange(event) {
		this.optionChange.emit(event);
		if (this.sendMetrics) {
			const metricsData = {
				ItemParent: this.metricsParent,
				ItemType: 'FeatureClick',
				ItemName: this.radioLabel + this.radioId,
				ItemValue: !this.checked,
			};
			this.metrics.sendMetrics(metricsData);
		}
	}

	getIconName(name: string) {
		if (this.processIcon) {
			if (name) {
				const arr = name.split(' ');
				const index = arr.indexOf('&');
				if (index !== -1) {
					arr.splice(index, 1);
				}
				return arr.join('').toLowerCase();
			} else {
				return '';
			}
		} else {
			return name;
		}
	}
}
