import {
	Component,
	OnInit
} from '@angular/core';
import {
	ModalLenovoIdComponent
} from '../../../modal-lenovo-id/modal-lenovo-id.component';
import {
	NgbModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-login-lenovo-id',
	templateUrl: './login-lenovo-id.component.html',
	styleUrls: ['./login-lenovo-id.component.scss']
})
export class LoginLenovoIdComponent implements OnInit {

	constructor(private modalService: NgbModal) {}

	ngOnInit() {}

	openLenovoId() {
		this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'lenovo-id-modal-size'
		});
	}
}
