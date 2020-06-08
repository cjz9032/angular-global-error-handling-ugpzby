import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceCancelComponent } from '../../modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';

@Component({
  selector: 'vtr-page-smart-performance',
  templateUrl: './page-smart-performance.component.html',
  styleUrls: ['./page-smart-performance.component.scss']
})
export class PageSmartPerformanceComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    public smartPerformanceService: SmartPerformanceService,
  ) { }

  ngOnInit() {
  }

}
