import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { VantageShellService } from '../services/vantage-shell/vantage-shell.service';


declare var window;

@Directive({
	selector: '[vtrMetrics]'
})
export class MetricsDirective {
	constructor(private el: ElementRef, private shellService: VantageShellService) {
		this.metrics = shellService.getMetrics();
	}

	private metrics: any;

	@Input() metricsItem: string;
	@Input() metricsEvent: string;
	@Input() metricsValue: string;
	@Input() metricsParent: string;
	@Input() metricsParam: string;

	// DocClick used
	@Input() metricsItemID: string;
	@Input() metricsItemCategory: string;
	@Input() metricsItemPosition: string;
	@Input() metricsViewOrder: string;
	@Input() metricsPageNumber: string;


	@HostListener('click', ['$event.target'])
	onclick(target) {

		var parents = this.getParents(target, "[data-component]");
		if (!this.metricsParent && parents) {
			this.metricsParent = parents.join('.');
		}
		const location = window.location.href.substring(window.location.href.indexOf('#') + 2).replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
		this.metricsItem = typeof this.metricsItem === 'string' ? this.metricsItem.split(" ").join("").toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '').substr(0, 25) : this.metricsItem;
		this.metricsEvent = typeof this.metricsEvent === 'string' ? this.metricsEvent.split(" ").join("").toLowerCase() : this.metricsEvent;
		this.metricsValue = typeof this.metricsValue === 'string' ? this.metricsValue.split(" ").join("").toLowerCase() : this.metricsValue;
		this.metricsParent = typeof this.metricsParent === 'string' ? this.metricsParent.split(" ").join("").toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '').substr(0, 25) : this.metricsParent;
		this.metricsParam = typeof this.metricsParam === 'string' ? this.metricsParam.split(" ").join("").toLowerCase() : this.metricsParam;
		if (this.metrics && this.metrics.sendAsync) {
			const data: any = {
				ItemName: this.metricsItem,
				ItemType: this.metricsEvent,
				ItemParent: location ? location + '.' + this.metricsParent : this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}

			if (typeof this.metricsValue !== 'undefined') {
				data.ItemValue = this.metricsValue;
			}
			if (this.metricsItemID) {
				data.ItemID = this.metricsItemID;
			}
			if (this.metricsItemCategory) {
				data.ItemCategory = this.metricsItemCategory;
			}
			if (this.metricsItemPosition) {
				data.ItemPosition = this.metricsItemPosition;
			}
			if (this.metricsViewOrder) {
				data.ViewOrder = this.metricsViewOrder;
			}
			if (this.metricsPageNumber) {
				data.PageNumber = this.metricsPageNumber;
			}
			this.metrics.sendAsync(data);
		}

		// just for debugging, would be removed in the future
		{
			const data: any = {
				ItemName: this.metricsItem,
				ItemType: this.metricsEvent,
				ItemParent: location ? location + '.' + this.metricsParent : this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}
			if (typeof this.metricsValue !== 'undefined') {
				data.ItemValue = this.metricsValue;
			}
			if (this.metricsItemID) {
				data.ItemID = this.metricsItemID;
			}
			if (this.metricsItemCategory) {
				data.ItemCategory = this.metricsItemCategory;
			}
			if (this.metricsItemPosition) {
				data.ItemPosition = this.metricsItemPosition;
			}
			if (this.metricsViewOrder) {
				data.ViewOrder = this.metricsViewOrder;
			}
			if (this.metricsPageNumber) {
				data.PageNumber = this.metricsPageNumber;
			}

			console.log('Sending the metrics [ItemType : ' + this.metricsEvent + ']\n' + JSON.stringify(data));
		}
	}

	getParents(elem, selector?) {

		var parents = [];
		var firstChar;
		if (selector) {
			firstChar = selector.charAt(0);
		}

		// Get matches
		for (; elem && elem !== document; elem = elem.parentNode) {
			if (selector) {

				// If selector is a class
				if (firstChar === '.') {
					if (elem.classList.contains(selector.substr(1))) {
						parents.push(elem);
					}
				}

				// If selector is an ID
				if (firstChar === '#') {
					if (elem.id === selector.substr(1)) {
						parents.push(elem);
					}
				}

				// If selector is a data attribute
				if (firstChar === '[') {

					if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
						parents.push(elem.getAttribute(selector.substr(1, selector.length - 2)));
					}
				}

				// If selector is a tag
				if (elem.tagName.toLowerCase() === selector) {
					parents.push(elem);
				}

			} else {
				parents.push(elem);
			}

		}

		// Return parents if any exist
		if (parents.length === 0) {
			return null;
		} else {
			return parents.reverse();
		}

	}

}
