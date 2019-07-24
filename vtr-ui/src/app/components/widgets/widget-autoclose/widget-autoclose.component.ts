import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAutocloseComponent } from '../../modal/modal-autoclose/modal-autoclose.component';

@Component({
  selector: 'vtr-widget-autoclose',
  templateUrl: './widget-autoclose.component.html',
  styleUrls: ['./widget-autoclose.component.scss']
})
export class WidgetAutocloseComponent implements OnInit {
  @Input() introTitle: string;
  public title: string;
  constructor(private modalService: NgbModal, ) { }

  ngOnInit() {
    this.title = this.introTitle;
  }

  openModal(event: Event): void {
    this.modalService.open(ModalAutocloseComponent, {
      centered: true,
      windowClass: 'autoClose-Modal'
    });
  }
}
