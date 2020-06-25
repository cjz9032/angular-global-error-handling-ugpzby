import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSmartPerformanceFeedbackComponent } from './modal-smart-performance-feedback.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ModalSmartPerformanceFeedbackComponent', () => {
  let component: ModalSmartPerformanceFeedbackComponent;
  let fixture: ComponentFixture<ModalSmartPerformanceFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSmartPerformanceFeedbackComponent ],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers:[NgbActiveModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSmartPerformanceFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
