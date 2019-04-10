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

	// SettingUpdate
	@Input() metricsSettingName: string;
	@Input() metricsSettingParm: string;
	@Input() metricsSettingValue: string;

	ComposeMetricsData() {
		const data: any = {
		};
		const eventName = this.metricsEvent.toLowerCase();
		switch (eventName) {
			case 'itemclick': {
				data.ItemType = 'ItemClick';
				data.ItemName = this.metricsItem;
				data.ItemParent = this.metricsParent;
				if (this.metricsParam) {
					data.ItemParm = this.metricsParam;
				}
				if (typeof this.metricsValue !== 'undefined') {
					data.ItemValue = this.metricsValue;
				}
			}
			break;
			case 'docclick': {
				data.ItemType = 'DocClick';
				data.ItemParent = this.metricsParent;
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
			}
			break;
			case 'settingupdate': {
				data.ItemType = 'SettingUpdate';
				data.SettingParent = this.metricsParent;
				data.SettingName = this.metricsSettingName;
				data.SettingValue = this.metricsSettingValue;
				if (this.metricsSettingParm) {
					data.SettingParm = this.metricsSettingParm;
				}
			}
		}
		return data;
	}

	@HostListener('click', ['$event.target'])
	onclick(target) {
		if (!this.metricsParent) {
			const location = window.location.href.substring(window.location.href.indexOf('#') + 2).replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
			if (location) {
				this.metricsParent = location;
			} else {
				const parents = this.getParents(target, "[data-component]");
				this.metricsParent = parents.join('.').split(' ').join('').toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '').substr(0, 25);
			}
		}

		const data = this.ComposeMetricsData();
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		}

		// for debug
		console.log('------reporting metrics------\n'.concat(JSON.stringify(data)));
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
