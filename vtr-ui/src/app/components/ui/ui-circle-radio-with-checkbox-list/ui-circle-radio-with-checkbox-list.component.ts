import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { UiCircleRadioWithCheckBoxListModel } from './ui-circle-radio-with-checkbox-list.model';
import { KeyCode as KEYCODE } from 'src/app/enums/key-code.enum';

@Component({
	selector: 'vtr-ui-circle-radio-with-checkbox-list',
	templateUrl: './ui-circle-radio-with-checkbox-list.component.html',
	styleUrls: ['./ui-circle-radio-with-checkbox-list.component.scss']
})
export class UiCircleRadioWithCheckBoxListComponent implements OnInit {
	@Input() metricsParent: string;
	@Input() tooltip: string;
	@Input() theme = 'white';
	@Input() sendMetrics = true;
	@Input() groupName = '';
	@Input() radioDetails: Array<UiCircleRadioWithCheckBoxListModel> = [];
	@Output() optionChange: EventEmitter<UiCircleRadioWithCheckBoxListModel> = new EventEmitter();

	@ViewChildren('radioRef') radioButtons: QueryList<any>;

	constructor(logger: LoggerService, private metrics: MetricService) {
	}

	ngOnInit() {
	}

	onClick($event) {
		const { id } = $event.currentTarget;
		const radio = this.updateSelection(id);
		this.invokeSelectionChangeEvent(radio);
		$event.preventDefault();
	}

	onKeyDown($event, index: number) {
		if (this.radioDetails && this.radioDetails.length > 0) {
			this.handleKeyPressEvent($event, index);
		}
	}

	private updateSelection(radioId: string): UiCircleRadioWithCheckBoxListModel {
		let radio: UiCircleRadioWithCheckBoxListModel;
		if (this.radioDetails && this.radioDetails.length > 0) {
			let hasFound = false;
			this.radioDetails.forEach(radioDetail => {
				if ((radioDetail.componentId === radioId)) {
					radio = radioDetail;
					hasFound = true;
					radioDetail.isChecked = true;
				} else {
					radioDetail.isChecked = false;
				}
			});

			// set selected if its found had requires focus
			if (hasFound) {
				this.radioButtons.forEach(radioButton => {
					if (radioButton.nativeElement.id === radioId) {
						radioButton.nativeElement.focus();
						radioButton.nativeElement.checked = true;
					}
				});
			}
		}
		return radio;
	}

	private setNodeActive(index: number): UiCircleRadioWithCheckBoxListModel {
		if (index >= 0) {
			const radioId = this.radioDetails[index].componentId;
			// get element by index and pass its id to next FN
			return this.updateSelection(radioId);
		}
		return null;
	}

	private handleKeyPressEvent(event, index: number) {
		const { type } = event;
		const { id } = event.target;
		let nextIndex = index;
		let isHandled = false;

		if (type === 'keydown') {
			// const node = event.currentTarget;

			switch (event.keyCode) {
				// next item
				case KEYCODE.DOWN:
				case KEYCODE.RIGHT:
					// if index is equal to last item then set 0 else ++
					nextIndex = (index === this.radioDetails.length - 1) ? 0 : index + 1;
					isHandled = true;

					break;
				// previous item
				case KEYCODE.UP:
				case KEYCODE.LEFT:
					// if index is equal to 0 item then set length -1 else --
					nextIndex = (index === 0) ? this.radioDetails.length - 1 : index - 1;
					isHandled = true;
					break;

				// for Narrator selection
				case KEYCODE.SPACE:
				case KEYCODE.RETURN:
					isHandled = true;
					break;
			}

			if (isHandled) {
				const radio = this.setNodeActive(nextIndex);
				this.invokeSelectionChangeEvent(radio);
				event.preventDefault();
				event.stopPropagation();
			}
		}
	}

	private invokeSelectionChangeEvent(radio: UiCircleRadioWithCheckBoxListModel) {
		if (radio) {
			this.optionChange.emit(radio);
			if (this.sendMetrics) {
				const metricsData = {
					ItemParent: this.metricsParent,
					ItemType: 'FeatureClick',
					ItemName: radio.componentId,
					ItemValue: radio.value
				};
				this.metrics.sendMetrics(metricsData);
			}
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
