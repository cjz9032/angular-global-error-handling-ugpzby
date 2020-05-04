import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { KeyCode as KEYCODE } from 'src/app/enums/key-code.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { UICustomRadio } from '../ui-custom-radio/ui-custom-radio';
import { AppEvent } from './../../../enums/app-event.enum';
import { UiRoundedRectangleRadioListModel, UiRoundedRectangleRadioModel } from './ui-rounded-rectangle-radio-list.model';

@Component({
	selector: 'vtr-ui-rounded-rectangle-radio-list',
	templateUrl: './ui-rounded-rectangle-radio-list.component.html',
	styleUrls: ['./ui-rounded-rectangle-radio-list.component.scss']
})
export class UiRoundedRectangleRadioListComponent implements OnInit, AfterViewInit {
	@Input() radioId: string;
	@Input() tooltip: string;
	@Input() disabled = false;
	@Input() name: string;
	@Input() isLarge = false;
	@Output() selectionChange = new EventEmitter<boolean>();

	public model = new UiRoundedRectangleRadioListModel(
		'pizza-radio-group',
		[
			new UiRoundedRectangleRadioModel(1, 'regular-crust', false, false),
			new UiRoundedRectangleRadioModel(2, 'thin-crust', false, true),
			new UiRoundedRectangleRadioModel(3, 'deep-dish', false, false),
		]
	);

	public currentSelection

	constructor(logger: LoggerService, metrics: MetricService) {
	}

	ngOnInit() { }

	ngAfterViewInit() {

	}

	onChange($event) {
		const { value } = $event.target;
		this.selectionChange.emit(value);
	}
	onkeyPress($event) {
		// 	const { keyCode } = $event;
		// 	if (keyCode === KeyCode.LEFT) {
		// 		this.customKeyEvent.emit({ customeEvent: AppEvent.LEFT });
		// 	} else if (keyCode === KeyCode.RIGHT) {
		// 		this.customKeyEvent.emit({ customeEvent: AppEvent.RIGHT });
		// 	}
		// }

	}

	onClick($event) {
		const { id, ariaChecked } = $event.target;
		this.updateSelection(id);
		console.log(id, ariaChecked);
	}

	onKeyDown($event) {
		this.handleKeyPressEvent($event);
	}

	private updateSelection(radioId: string) {
		if (this.model && this.model.radioDetails?.length > 0) {
			this.model.radioDetails.forEach(radioDetail => {
				radioDetail.isChecked = (radioDetail.componentId === radioId);
			});
		}
	}

	private handleKeyPressEvent(event) {
		const { type } = event;
		let next;

		if (type === 'keydown') {
			const node = event.currentTarget;

			switch (event.keyCode) {
				case KEYCODE.DOWN:
				case KEYCODE.RIGHT:

					break;

				case KEYCODE.UP:
				case KEYCODE.LEFT:

					break;

				case KEYCODE.SPACE:
					next = node;
					break;
			}
		}
	}
}
