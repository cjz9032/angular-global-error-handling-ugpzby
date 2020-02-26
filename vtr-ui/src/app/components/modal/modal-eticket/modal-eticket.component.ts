import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'vtr-modal-eticket',
  templateUrl: './modal-eticket.component.html',
  styleUrls: ['./modal-eticket.component.scss']
})
export class ModalEticketComponent implements OnInit {
  @Input() title = this.translate.instant('hardwareScan.eTicket.header');
  @Input() ticketDescription1 = this.translate.instant('hardwareScan.eTicket.problemDetected');
  @Input() ticketDescription2 = this.translate.instant('hardwareScan.eTicket.ticketRequestQuestion');
  @Input() buttonText = this.translate.instant('hardwareScan.eTicket.openTicket');

  @Input() moduleNames;
  @Input() eTicketUrl;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {  }

  ngOnInit() {
  }

  closeModal() {
		this.activeModal.close('close');
	}

  setUrl(url: string){
    this.eTicketUrl = url;
    document.getElementById("lenovoSupportTicket").setAttribute("href",this.eTicketUrl);
  }

}
