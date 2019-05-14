import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-support-wechat',
	templateUrl: './modal-support-wechat.component.html',
	styleUrls: ['./modal-support-wechat.component.scss']
})
export class ModalSupportWechatComponent implements OnInit, AfterViewInit {

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	ngAfterViewInit() {
		setTimeout(() => { document.getElementById('weChat-dialog').parentElement.parentElement.parentElement.parentElement.focus(); }, 0);
	}

	public onCancelClick() {
		this.activeModal.close(false);
	}
}
