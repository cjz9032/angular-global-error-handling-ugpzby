import { Component, OnInit } from '@angular/core';
import {CommonPopupService} from '../../common-services/popups/common-popup.service';

@Component({
  selector: 'vtr-support-banner',
  templateUrl: './support-banner.component.html',
  styleUrls: ['./support-banner.component.scss']
})
export class SupportBannerComponent implements OnInit {

  constructor(private commonPopupService: CommonPopupService) { }

  ngOnInit() {
    // FIXME no need use string
    this.commonPopupService.close$('support-popup')
        .subscribe(id => console.log('close', id))
  }

  openPopup(id) {
    this.commonPopupService.open(id);
  }

  closePopup(id) {
    this.commonPopupService.close(id);
  }
}
