import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { KeyCode as KEYCODE } from 'src/app/enums/key-code.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { UiRoundedRectangleRadioModel } from './ui-rounded-rectangle-radio-list.model';
import { ActivatedRoute } from '@angular/router';

/**
 * this radio group implementation is based on W3C KB navigation example
 * https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html
 */
@Component({
	selector: 'vtr-ui-rounded-rectangle-custom-radio-list',
	templateUrl: './ui-rounded-rectangle-custom-radio-list.component.html',
	styleUrls: ['./ui-rounded-rectangle-custom-radio-list.component.scss']
})
export class UiRoundedRectangleCustomRadioListComponent implements OnInit, OnChanges {
	@Input() groupName: string;
	@Input() isVertical = false;
	@Input() sendMetrics = true;
	@Input() metricsEvent = 'ItemClick';
	@Input() metricsParent;
	@Input() radioDetails: Array<UiRoundedRectangleRadioModel>;

	@Output() selectionChange = new EventEmitter<UiRoundedRectangleRadioModel>();

	@ViewChildren('radioRef') radioButtons: QueryList<any>;
	@ViewChild('radioGroupRef', { static: false }) radioGroupRef: ElementRef;
	public activeDescendantId;
	public focusedComponentId = '';

	constructor(logger: LoggerService
		, private metrics: MetricService
		, private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.radioDetails) {
			this.activeDescendantId = this.getSelectedRadioId();
		}
	}

	onClick($event) {
		const { id } = $event.target;
		const radio = this.updateSelection(id);
		this.invokeSelectionChangeEvent(radio);
		this.setFocusComponentId();
		$event.preventDefault();
	}

	onKeyDown($event) {
		if (this.radioDetails && this.radioDetails.length > 0) {
			this.handleKeyPressEvent($event);
			this.setFocusComponentId();
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
			if (hasFound) {
				this.radioButtons.forEach(radioButton => {
					if (radioButton.nativeElement.id === radioId) {
						radioButton.nativeElement.checked = true;
						radioButton.nativeElement.setAttribute('aria-checked', 'true');
					}
				});
			}

			if (this.radioGroupRef) {
				this.radioGroupRef.nativeElement.setAttribute('aria-activedescendant', radioId);
				this.radioGroupRef.nativeElement.focus();
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

	private handleKeyPressEvent(event) {
		const { type } = event;
		const id = this.getSelectedRadioId();
		const index = this.getRadioById(id);
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

		if (this.sendMetrics) {
			const metricsData = {
				ItemParent: this.metricsParent || this.activatedRoute.snapshot.data.pageName,
				ItemType: 'FeatureClick',
				ItemName: radio.metricsValue,
				ItemValue: radio.isChecked
			};
			this.metrics.sendMetrics(metricsData);
		}
	}

	onRadioGroupFocus($event) {
		this.setFocusComponentId();
	}

	onRadioGroupBlur($event) {
		this.focusedComponentId = '';
	}

	private setFocusComponentId() {
		this.focusedComponentId = this.getSelectedRadioId();
	}

	private getRadioById(componentId: string): number {
		let itemIndex = -1;
		if (this.radioDetails && this.radioDetails.length > 0) {
			let hasFound = false;
			this.radioDetails.forEach((radioDetail, index) => {
				if ((radioDetail.componentId === componentId)) {
					hasFound = true;
					itemIndex = index;
				}
			});
		}
		return itemIndex;
	}

	private getSelectedRadioId(): string {
		let selectedRadioId = '';
		if (this.radioDetails && this.radioDetails.length > 0) {
			this.radioDetails.forEach((radioDetail) => {
				if ((radioDetail.isChecked)) {
					selectedRadioId = radioDetail.componentId;
				}
			});
		}
		return selectedRadioId;
	}
}
