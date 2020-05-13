import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { UiCircleRadioWithCheckBoxListModel } from './ui-circle-radio-with-checkbox-list.model';

@Component({
	selector: 'vtr-ui-circle-radio-with-checkbox-list',
	templateUrl: './ui-circle-radio-with-checkbox-list.component.html',
	styleUrls: ['./ui-circle-radio-with-checkbox-list.component.scss']
})
export class UiCircleRadioWithCheckBoxListComponent implements OnInit, AfterViewInit {
	@Input() metricsParent: string;
	@Input() tooltip: string;
	@Input() theme = 'white';
	@Input() sendMetrics = true;
	@Input() groupName = '';
	@Input() radioDetails: Array<UiCircleRadioWithCheckBoxListModel> = [];
	@Output() optionChange: EventEmitter<UiCircleRadioWithCheckBoxListModel> = new EventEmitter();

	constructor(logger: LoggerService, private metrics: MetricService) {
	}

	ngAfterViewInit(): void {
	}

	ngOnInit() {
	}

	onChange(item: UiCircleRadioWithCheckBoxListModel) {
		this.optionChange.emit(item);
		if (this.sendMetrics) {
			// const metricsData = {
			// 	ItemParent: this.metricsParent,
			// 	ItemType: 'FeatureClick',
			// 	ItemName: this.radioLabel + this.label,
			// 	ItemValue: !this.checked
			// };
			// this.metrics.sendMetrics(metricsData);
		}
	}

	getIconName(item: UiCircleRadioWithCheckBoxListModel) {
		if (item.processIcon) {
			if (item.value) {
				const arr = item.value.split(' ');
				const index = arr.indexOf('&');
				if (index !== -1) {
					arr.splice(index, 1);
				}
				return arr.join('').toLowerCase();
			} else {
				return '';
			}
		} else {
			return item.value.toLowerCase();
		}
	}

}
