import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BrowserListType } from '../../../../core/services/vantage-communication.service';

@Component({
	selector: 'vtr-remove-password',
	templateUrl: './remove-password.component.html',
	styleUrls: ['./remove-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemovePasswordComponent {
	@Input() browserName: BrowserListType;
	@Input() popupId: string;
	@Output() buttonClick = new EventEmitter();

	@ViewChild('chrome', { static: true }) chrome: ElementRef;
	@ViewChild('edge', { static: true }) edge: ElementRef;
	@ViewChild('firefox', { static: true }) firefox: ElementRef;

	getTemplate(browserName: BrowserListType) {
		let template = this.chrome;

		if (browserName === BrowserListType.firefox) {
			template = this.firefox;
		}

		if (browserName === BrowserListType.edge) {
			template = this.edge;
		}

		return template;
	}

	buttonClickEmit() {
		this.buttonClick.emit(true);
	}

}
