import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList } from '@angular/core';
import { KeyCode as KEYCODE } from 'src/app/enums/key-code.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { UiRoundedRectangleRadioListModel, UiRoundedRectangleRadioModel } from './ui-rounded-rectangle-radio-list.model';

/**
 * this radio group implementation is based on W3C KB navigation example
 * https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html
 */
@Component({
	selector: 'vtr-ui-rounded-rectangle-radio-list',
	templateUrl: './ui-rounded-rectangle-radio-list.component.html',
	styleUrls: ['./ui-rounded-rectangle-radio-list.component.scss']
})
export class UiRoundedRectangleRadioListComponent implements OnInit {
	@Input() radioId: string;
	@Input() tooltip: string;
	@Input() disabled = false;
	@Input() name: string;
	@Input() isLarge = false;
	@Input() metricsEvent = 'ItemClick';

	@Output() selectionChange = new EventEmitter<UiRoundedRectangleRadioModel>();

	@ViewChildren('radioRef') radioButtons: QueryList<any>;

	public model = new UiRoundedRectangleRadioListModel(
		'pizza-radio-group',
		[
			new UiRoundedRectangleRadioModel('regular-crust', false, false, 'regular crust'),
			new UiRoundedRectangleRadioModel('thin-crust', false, true, 'thin crust'),
			new UiRoundedRectangleRadioModel('deep-dish', false, false, 'deep dish'),
		]
	);

	constructor(logger: LoggerService, metrics: MetricService) {
	}

	ngOnInit() { }

	onClick($event) {
		const { id } = $event.target;
		const radio = this.updateSelection(id);
		this.invokeSelectionChangeEvent(radio);
	}

	onKeyDown($event, index: number) {
		if (this.model?.radioDetails?.length > 0) {
			this.handleKeyPressEvent($event, index);
		}
	}

	private updateSelection(radioId: string, hasFocus = false) {
		let radio: UiRoundedRectangleRadioModel;
		if (this.model?.radioDetails?.length > 0) {
			let hasFound = false;
			this.model.radioDetails.forEach(radioDetail => {
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
					}
				});
			}
		}
		return null;
	}

	private setNodeActive(index: number): UiRoundedRectangleRadioModel {
		if (index >= 0) {
			const radioId = this.model.radioDetails[index].componentId;
			// get element by index and pass its id to next FN
			return this.updateSelection(radioId, true);
		}
		return null;
	}

	private handleKeyPressEvent(event, index) {
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
					nextIndex = (index === this.model.radioDetails.length - 1) ? 0 : index + 1;
					isHandled = true;

					break;
				// previous item
				case KEYCODE.UP:
				case KEYCODE.LEFT:
					// if index is equal to 0 item then set length -1 else --
					nextIndex = (index === 0) ? this.model.radioDetails.length - 1 : index - 1;
					isHandled = true;
					break;

				// for Narrator selection
				case KEYCODE.SPACE:
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
