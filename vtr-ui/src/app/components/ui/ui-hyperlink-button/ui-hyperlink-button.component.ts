import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

@Component({
	selector: 'vtr-ui-hyperlink-button',
	templateUrl: './ui-hyperlink-button.component.html',
	styleUrls: ['./ui-hyperlink-button.component.scss']
})
export class UiHyperlinkButtonComponent implements OnInit {

	@Input() vtrMetricEnabled: any;
	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() metricsValue: any;
	@Input() metricsEvent = 'FeatureClick';
	@Input() metricsParam: string;
	@Input() metricsItemID: any;
	@Input() metricsItemPosition: any;
	@Input() metricsItemCategory: any;
	@Input() metricsPageNumber: string;

	@Input() hyperlinkStyle: string;
	@Input() label: string;
	@Input() title: string;
	@Input() tabIndex: number;
	@Input() upperCaseLabel: boolean;
	@Input() capitalizeLabel: boolean;
	@Input() isDisabled = false;

	@Input() ariaLabel: string;
	@Input() tooltipText: string;
	@Input() disableTooltip = false;

	@Input() faIcon: IconProp;
	@Input() faIconStyle: string;

	@Output() hyperlinkClick = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
		this.ariaLabel = this.ariaLabel ?? this.label;
		this.tooltipText = this.tooltipText ?? this.label;
		this.faIconStyle = this.faIconStyle ?? this.hyperlinkStyle;
	}

	onClick() {
		if (!this.isDisabled) {
			this.hyperlinkClick.emit();
		}
	}

}
