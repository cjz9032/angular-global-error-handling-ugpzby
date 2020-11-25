import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-snapshot',
  templateUrl: './modal-snapshot.component.html',
  styleUrls: ['./modal-snapshot.component.scss']
})
export class ModalSnapshotComponent implements OnInit {
	@Input() snapshotInfo: any;

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit(): void {
	}

	public closeModal() {
		this.activeModal.close();
	}

	public closeButtonClick() {
		this.activeModal.dismiss();
	}

}
