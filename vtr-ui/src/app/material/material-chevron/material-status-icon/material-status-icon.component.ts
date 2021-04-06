import { Component, Input } from '@angular/core';

export type StatusIconType =
	| 'loading'
	| 'loadFailed'
	| 'enabled'
	| 'disabled'
	| 'partially'
	| 'installState'
	| 'pause'
	| 'scanning'
	| 'needAttention';

@Component({
	selector: 'vtr-material-status-icon',
	templateUrl: './material-status-icon.component.html',
	styleUrls: ['./material-status-icon.component.scss'],
})
export class MaterialStatusIconComponent {
	@Input() status: StatusIconType;
	@Input() id = '';

	itemStatusIconClass = {
		enabled: 'check',
		disabled: 'times',
		partially: 'minus',
		installState: 'circle',
		pause: 'pause',
		needAttention: 'exclamation',
	};

	getItemStatusIconClass(status: StatusIconType) {
		let itemStatIconClass = 'good';
		if (status !== undefined) {
			if (this.itemStatusIconClass.hasOwnProperty(status)) {
				itemStatIconClass = this.itemStatusIconClass[status];
			}
		}
		return itemStatIconClass;
	}
}
