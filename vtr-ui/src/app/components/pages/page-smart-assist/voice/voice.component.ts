import { Component, OnInit } from '@angular/core';
import { ModalVoiceComponent } from 'src/app/components/modal/modal-voice/modal-voice.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})
export class VoiceComponent implements OnInit {

  constructor(public modalService: NgbModal) { }

  ngOnInit() {
  }

  voicePopUp(stringValue) {
	console.log("modal open");
	const modalRef = this.modalService.open(ModalVoiceComponent,
		{
			backdrop: 'static',
			size: 'sm',
			centered: true,
			windowClass: 'Voice-Modal',
		});
	modalRef.componentInstance.value = stringValue;

}

}
