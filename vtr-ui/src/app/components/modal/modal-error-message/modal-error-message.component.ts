import { Component, Input } from '@angular/core';


@Component({
	selector: 'vtr-modal-error-message',
	templateUrl: './modal-error-message.component.html',
	styleUrls: ['./modal-error-message.component.scss'],
})
export class ModalErrorMessageComponent {
	@Input() header: string;
	@Input() description: string;
	@Input() closeText = 'security.wifisecurity.errorMessage.closeText';
	@Input() closeButtonId: string;
	@Input() cancelButtonId: string;
}
