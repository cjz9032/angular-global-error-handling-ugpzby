import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MetricEventName } from 'src/app/enums/metrics.enum';
import { FeatureClick } from 'src/app/services/metric/metrics.model';
import { MetricService } from 'src/app/services/metric/metrics.service';

@Component({
	selector: 'vtr-search-input-widget',
	templateUrl: './search-input-widget.component.html',
	styleUrls: ['./search-input-widget.component.scss'],
})
export class SearchInputWidgetComponent {
	@Input() input: string = '';
	@Output() inputChange = new EventEmitter<string>();
	@Output() search = new EventEmitter();
	@Input() disabled: boolean = false;
	@Input() iconClickable: boolean = false;
	@Input() showSearchButton: boolean = true;
	@Input() placeholder: string = '';
	@Input() maxlength: number = 30;
	@Input() idPrefix: string;
	@Input() customMetricParent: string;
	@ViewChild('inputCtrl') inputCtrl: ElementRef;

	private enterSearchEvent: FeatureClick = {
		ItemType: MetricEventName.featureclick,
		ItemParent: 'Page.Search',
		ItemName: 'input.search',
	};

	constructor(private metricsService: MetricService) {}

	onClickSearch() {
		this.search.emit();
	}

	onInputEnterKeyDown() {
		if (this.disabled) {
			return;
		}

		this.metricsService.sendMetrics(this.enterSearchEvent);
		this.search.emit();
	}

	onClickInput() {
		setTimeout(() => {
			this.setInputFocus();
		}, 200);
	}

	onInputChange() {
		this.inputChange.emit(this.input);
	}

	setInputFocus() {
		this.inputCtrl?.nativeElement.focus();
	}
}
