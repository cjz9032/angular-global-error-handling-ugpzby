import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import {formatDate} from '@angular/common';



@Component({
  selector: 'vtr-modal-smart-performance-subscribe',
  templateUrl: './modal-smart-performance-subscribe.component.html',
  styleUrls: ['./modal-smart-performance-subscribe.component.scss']
})
export class ModalSmartPerformanceSubscribeComponent implements OnInit {
  
  myDate = new Date();
  public subscriptionDetails=[
    {
      "UUID":uuid(),
      "StartDate":formatDate(new Date(), 'yyyy/MM/dd', 'en'),
      "EndDate":formatDate(this.myDate.setDate(new Date().getDate()+90), 'yyyy/MM/dd', 'en')
    }
  ];
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
  this.commonService.setLocalStorageValue(LocalStorageKey.SubscribtionDetails,this.subscriptionDetails);
	console.log(this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed));
  this.closeModal();
  location.reload();
	// this.router.navigate(['device/smart-performance']);
}

  @HostListener('window: focus')
  onFocus(): void {
  const modal = document.querySelector('.subscribe-modal') as HTMLElement;
		modal.focus();
  }
}
