import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'vtr-modal-smart-performance-subscribe',
  templateUrl: './modal-smart-performance-subscribe.component.html',
  styleUrls: ['./modal-smart-performance-subscribe.component.scss']
})
export class ModalSmartPerformanceSubscribeComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,private commonService: CommonService,
	// private router: Router
	) { }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close('close');
}
selectBilledMonthly(){
	alert("You Have Successfully Subscibed");
	this.commonService.setLocalStorageValue(LocalStorageKey.IsSubscribed,true);
	console.log(this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed));
	this.closeModal();
	// this.router.navigate(['device/smart-performance']);
}
}
