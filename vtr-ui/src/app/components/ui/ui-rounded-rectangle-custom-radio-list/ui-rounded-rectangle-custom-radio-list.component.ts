import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList } from '@angular/core';
import { KeyCode as KEYCODE } from 'src/app/enums/key-code.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { UiRoundedRectangleRadioModel } from './ui-rounded-rectangle-radio-list.model';

/**
 * this radio group implementation is based on W3C KB navigation example
 * https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html
 */
@Component({
	selector: 'vtr-ui-rounded-rectangle-custom-radio-list',
	templateUrl: './ui-rounded-rectangle-custom-radio-list.component.html',
	styleUrls: ['./ui-rounded-rectangle-custom-radio-list.component.scss']
})
export class UiRoundedRectangleCustomRadioListComponent implements OnInit {
	@Input() groupName: string;
	@Input() isVertical = false;
	@Input() metricsEvent = 'ItemClick';
	@Input() radioDetails: Array<UiRoundedRectangleRadioModel>;

	@Output() selectionChange = new EventEmitter<UiRoundedRectangleRadioModel>();

	@ViewChildren('radioRef') radioButtons: QueryList<any>;

	// public model1 = new UiRoundedRectangleRadioListModel(
	// 	'pizza-radio-group',
	// 	[
	// 		new UiRoundedRectangleRadioModel('regular-crust', 'regular crust', 'regular crust', false, false),
	// 		new UiRoundedRectangleRadioModel('thin-crust', 'thin crust', 'thin crust', false, false),
	// 		new UiRoundedRectangleRadioModel('deep-dish', 'deep dish', 'deep dish', false, false),
	// 	]
	// );


	constructor(logger: LoggerService, metrics: MetricService) {
	}

	ngOnInit() { }

	onClick($event) {
		const { id } = $event.target;
		const radio = this.updateSelection(id);
		this.invokeSelectionChangeEvent(radio);
		$event.preventDefault();
	}

	onKeyDown($event, index: number) {
		if (this.radioDetails && this.radioDetails.length > 0) {
			this.handleKeyPressEvent($event, index);
		}
	}

	private updateSelection(radioId: string, hasFocus = false): UiRoundedRectangleRadioModel {
		let radio: UiRoundedRectangleRadioModel;
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
			if (hasFound && hasFocus) {
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

	private setNodeActive(index: number): UiRoundedRectangleRadioModel {
		if (index >= 0) {
			const radioId = this.radioDetails[index].componentId;
			// get element by index and pass its id to next FN
			return this.updateSelection(radioId, true);
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

	private invokeSelectionChangeEvent(radio: UiRoundedRectangleRadioModel) {
		this.selectionChange.emit(radio);
	}
}
