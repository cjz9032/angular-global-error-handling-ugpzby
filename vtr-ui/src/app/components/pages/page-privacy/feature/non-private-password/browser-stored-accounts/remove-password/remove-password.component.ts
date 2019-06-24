import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { BrowserListType } from '../../../../common/services/vantage-communication.service';

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

	@ViewChild('chrome') chrome: ElementRef;
	@ViewChild('edge') edge: ElementRef;
	@ViewChild('firefox') firefox: ElementRef;

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
